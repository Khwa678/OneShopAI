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

// Security Headers via Helmet & Custom Security Policies (M1 & Security Fix)
app.use(
  helmet({
    noSniff: true,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com", "https://www.google.com", "https://www.gstatic.com", "https://challenges.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com", "https://generativelanguage.googleapis.com", "https://openrouter.ai", "https://api.deepseek.com", "https://api.ocr.space", "https://oauth2.googleapis.com", "https://www.google.com", "https://www.gstatic.com", "https://my-project-is-ready.onrender.com", "https://*.onrender.com"],
        frameSrc: ["'self'", "https://accounts.google.com", "https://www.google.com", "https://challenges.cloudflare.com"],
        frameAncestors: ["'self'"],
        objectSrc: ["'none'"]
      }
    }
  })
);

// Explicit Custom Security Headers Middleware (Enforcing X-Frame-Options, CSP, HSTS, Referrer-Policy, Permissions-Policy)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.google.com https://www.gstatic.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.deepseek.com https://api.ocr.space https://oauth2.googleapis.com https://www.google.com https://www.gstatic.com https://my-project-is-ready.onrender.com https://*.onrender.com; frame-src 'self' https://accounts.google.com https://www.google.com https://challenges.cloudflare.com; frame-ancestors 'self'; object-src 'none'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), accelerometer=(), gyroscope=(), magnetometer=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Dynamically allow requesting origin for credentials support
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Configurable Rate Limiters to Protect API Keys & Server Resources
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes."
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute window
  max: parseInt(process.env.AI_RATE_LIMIT_MAX || '10', 10), // Limit per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI Rate limit exceeded. Please wait a minute before making more requests."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '15', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  }
});

const cookieParser = require('cookie-parser');

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Global API Rate Limiter
app.use('/api', apiLimiter);

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes with Specific Rate Limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/blogs', blogRoutes);

// Root and Health Endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DocsAI Backend Running 🚀',
    version: '1.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DocsAI Agent API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 DocsAI Backend running on Port ${PORT}`);
});

module.exports = app;
