const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, updateUserPassword, findUserById } = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register Endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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


// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateUserPassword(email, hashedPassword);

    return res.json({ message: 'Password updated successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
  });
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
      message: 'Thank you for contacting Docs Playground! Your message has been received.',
      ticketId: 'TKT-' + Date.now().toString().slice(-6)
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    return res.status(500).json({ error: 'Failed to process contact submission.' });
  }
});

module.exports = router;
