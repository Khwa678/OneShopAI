require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'docs-ai-secret-key-2026';

// In-memory tracking for guest IP AI requests (Max 5 requests before requiring login)
const guestUsageStore = new Map();
const MAX_GUEST_FREE_LIMIT = 5;

function getTokenFromReq(req) {
  if (req.cookies && req.cookies.docs_ai_token) {
    return req.cookies.docs_ai_token;
  }
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

function authenticateToken(req, res, next) {
  const token = getTokenFromReq(req);

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
}

function requireAuth(req, res, next) {
  const token = getTokenFromReq(req);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in or sign up to access AI tools.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware: Limits unauthenticated guest users to 5 requests only.
 * Once 5 requests are reached, returns HTTP 403 requiring user to Log In or Register.
 */
function checkGuestUsageLimit(req, res, next) {
  if (req.user) {
    // Logged-in users are authenticated and have full access
    return next();
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'guest_client';
  const currentCount = guestUsageStore.get(clientIp) || 0;

  if (currentCount >= MAX_GUEST_FREE_LIMIT) {
    return res.status(403).json({
      success: false,
      requireLogin: true,
      usageCount: currentCount,
      maxLimit: MAX_GUEST_FREE_LIMIT,
      error: `🔒 Free limit of ${MAX_GUEST_FREE_LIMIT} requests reached! Please Log In or Create a Free Account to continue using DocsAI tools.`
    });
  }

  // Increment usage count for guest IP
  const newCount = currentCount + 1;
  guestUsageStore.set(clientIp, newCount);

  res.setHeader('X-Guest-Usage-Count', newCount);
  res.setHeader('X-Guest-Usage-Remaining', MAX_GUEST_FREE_LIMIT - newCount);

  next();
}

/**
 * Helper to query current guest usage for an IP
 */
function getGuestUsageInfo(req) {
  if (req.user) return { isLoggedUser: true, usageCount: 0, remaining: Infinity };
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'guest_client';
  const count = guestUsageStore.get(clientIp) || 0;
  return {
    isLoggedUser: false,
    usageCount: count,
    maxLimit: MAX_GUEST_FREE_LIMIT,
    remaining: Math.max(0, MAX_GUEST_FREE_LIMIT - count)
  };
}

module.exports = {
  authenticateToken,
  requireAuth,
  checkGuestUsageLimit,
  getGuestUsageInfo,
  JWT_SECRET,
  MAX_GUEST_FREE_LIMIT
};
