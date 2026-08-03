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

// CORS configuration - Mounted at top before Helmet, rate limiters, or custom security policies
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

// Security Headers via Helmet & Custom Security Policies (M1 Fix)
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
        connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com", "https://generativelanguage.googleapis.com", "https://openrouter.ai", "https://api.deepseek.com", "https://api.ocr.space", "https://oauth2.googleapis.com", "https://www.google.com"],
        frameSrc: ["'self'", "https://accounts.google.com", "https://www.google.com", "https://challenges.cloudflare.com"],
        objectSrc: ["'none'"]
      }
    }
  })
);

// Explicit Custom Security Headers Middleware (M1 Fix)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.google.com https://www.gstatic.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.deepseek.com https://api.ocr.space https://oauth2.googleapis.com https://www.google.com; frame-src 'self' https://accounts.google.com https://www.google.com https://challenges.cloudflare.com; object-src 'none'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Configurable Rate Limiters
const aiLimitMax = parseInt(process.env.AI_RATE_LIMIT_MAX || '30', 10);
const authLimitMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '15', 10);

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: aiLimitMax, // Limit each IP to configured AI requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to AI endpoints from this IP. Please try again in 15 minutes.' }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: authLimitMax, // Limit each IP to configured auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const cookieParser = require('cookie-parser');

// Middlewares
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

// Root and Health Endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Docs Playground Backend Running 🚀',
    version: '1.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Docs Playground Agent API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Docs Playground Backend running on Port ${PORT}`);
});

module.exports = app;
