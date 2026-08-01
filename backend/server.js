const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const aiRoutes = require('./routes/ai');
const blogRoutes = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 5005;

// Security Headers via Helmet & Custom Security Policies
app.use(
  helmet({
    noSniff: true,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com", "https://generativelanguage.googleapis.com", "https://openrouter.ai", "https://api.deepseek.com", "https://api.ocr.space", "https://oauth2.googleapis.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        objectSrc: ["'none'"]
      }
    }
  })
);

// Explicit Custom Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  next();
});

// Rate Limiters
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 AI requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to AI endpoints from this IP. Please try again in 15 minutes.' }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const cookieParser = require('cookie-parser');

// Middlewares
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes with Rate Limiters
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRateLimiter, aiRoutes);
app.use('/api/blogs', blogRoutes);

// Serve Frontend Static Build Assets (Unified Full-Stack Production)
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const altDistPath = path.join(__dirname, 'dist');
const activeDist = fs.existsSync(frontendDistPath) ? frontendDistPath : fs.existsSync(altDistPath) ? altDistPath : null;

if (activeDist) {
  app.use(express.static(activeDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(activeDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('🚀 Docs Playground API Server Live');
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Docs Playground Agent API', timestamp: new Date().toISOString() });
});

// Start Express Server with dynamic port allocation
function startServer(portToUse) {
  const srv = app.listen(portToUse, () => {
    console.log(`🚀 Docs Playground Backend running on Port ${portToUse}`);
  });

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToUse < 5020) {
      console.warn(`⚠️ Port ${portToUse} is in use. Retrying on Port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('Server listen error:', err.message);
    }
  });
}

startServer(PORT);

module.exports = app;
