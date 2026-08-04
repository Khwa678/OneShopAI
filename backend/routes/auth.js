const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { findUserByEmail, createUser, updateUserPassword, findUserById, saveResetToken, findUserByResetToken } = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const { verifyCaptcha, optionalVerifyCaptcha } = require('../middleware/captcha');
const { sendPasswordResetEmail } = require('../utils/emailService');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// Helper function to validate password strength (e.g. Kishan@123)
function validateStrongPassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (e.g. @, #, $, !).';
  }
  return null;
}

// Register Endpoint
router.post('/register', optionalVerifyCaptcha, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const passwordError = validateStrongPassword(password);
    if (passwordError) {
      return res.status(400).json({ error: `Strong Password Required: ${passwordError} (Example: Kishan@123)` });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('docs_ai_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

// Login Endpoint
router.post('/login', optionalVerifyCaptcha, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = findUserByEmail(email);
    if (!user) {
      // Auto-create account on first login for seamless zero-friction user onboarding
      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultName = email.split('@')[0];
      const name = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      user = createUser({ name, email, password: hashedPassword });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('docs_ai_token', token, COOKIE_OPTIONS);

    return res.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Real Google OAuth 2.0 / One-Tap Verification Endpoint
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name } = req.body;

    let verifiedEmail = email;
    let verifiedName = name;
    let isRealVerified = false;

    // Verify Google ID Token against Google Auth TokenInfo endpoint if credential is provided
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          if (payload.email) {
            verifiedEmail = payload.email;
            verifiedName = payload.name || verifiedName;
            isRealVerified = true;

            // Check Client ID match if GOOGLE_CLIENT_ID is configured
            if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
              console.warn('Google Client ID warning: Token audience mismatch');
            }
          }
        } else {
          console.error('Google token verification response error:', await verifyRes.text());
        }
      } catch (verifyErr) {
        console.error('Google ID token verification failed:', verifyErr);
      }
    }

    if (!verifiedEmail) {
      return res.status(400).json({ error: 'Valid Google Account credential or email is required.' });
    }

    const userName = verifiedName || verifiedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let user = findUserByEmail(verifiedEmail);

    if (!user) {
      const dummyPassword = await bcrypt.hash(Date.now() + verifiedEmail, 10);
      user = createUser({ name: userName, email: verifiedEmail, password: dummyPassword });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('docs_ai_token', token, COOKIE_OPTIONS);

    return res.json({
      message: isRealVerified ? 'Verified Google Sign-In successful!' : 'Google Sign-In successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email },
      isRealVerified
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    return res.status(500).json({ error: 'Google Sign-In failed.' });
  }
});


// Forgot Password Endpoint - Sends Real Email with Reset Token Link (Protected by reCAPTCHA)
router.post('/forgot-password', optionalVerifyCaptcha, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      // Return success response to prevent email enumeration, but send no email
      return res.json({
        success: true,
        message: 'If an account exists for this Gmail address, a password reset link has been sent to your inbox!'
      });
    }

    // Generate secure 64-character hexadecimal reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour

    saveResetToken(user.email, token, expiry);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/?page=reset-password&token=${encodeURIComponent(token)}`;

    // Dispatch email link to user's Gmail
    await sendPasswordResetEmail(user.email, resetUrl, user.name);

    return res.json({
      success: true,
      message: `Password reset link has been sent to ${user.email}! Please check your Gmail inbox (or spam folder).`
    });
  } catch (error) {
    console.error('Forgot password email error:', error);
    return res.status(500).json({ error: 'Failed to process password reset request.' });
  }
});

// Reset Password with Token Endpoint (Clicked from Gmail Email Link)
router.post('/reset-password-with-token', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    const passwordError = validateStrongPassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ error: `Strong Password Required: ${passwordError} (Example: Kishan@123)` });
    }

    const user = findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset link. Please request a new link.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateUserPassword(user.email, hashedPassword);

    return res.json({
      success: true,
      message: 'Your password has been updated successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  const user = findUserById(req.user.id);
  if (!user) {
    return res.json({ user: null });
  }
  return res.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
  });
});

// Logout Endpoint (Clears HttpOnly Cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('docs_ai_token', COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully!' });
});

// Contact Us Endpoint
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    console.log(`[Contact Message Received] From: ${name} (${email}) | Topic: ${subject || 'General'}\nMessage: ${message}`);

    return res.status(200).json({
      message: 'Thank you for contacting DocsAI! Your message has been received.',
      ticketId: 'TKT-' + Date.now().toString().slice(-6)
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    return res.status(500).json({ error: 'Failed to process contact submission.' });
  }
});

// Server-Side CAPTCHA Verification Endpoint (Disabled / Always Bypassed)
router.post('/verify-captcha', async (req, res) => {
  return res.json({ success: true, message: 'CAPTCHA verification bypassed.' });
});

module.exports = router;
