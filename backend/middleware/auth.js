require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'docs-playground-secret-key-2026';

function getTokenFromReq(req) {
  if (req.cookies && req.cookies.docs_playground_token) {
    return req.cookies.docs_playground_token;
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

module.exports = {
  authenticateToken,
  requireAuth,
  JWT_SECRET
};
