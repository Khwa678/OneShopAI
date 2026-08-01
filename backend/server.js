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

// Permissions-Policy Header Middleware
app.use((req, res, next) => {
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
  origin: true,
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

// Root API Landing Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ZeroGPT Docs Playground API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #004d73; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .card { background: rgba(255,255,255,0.12); padding: 40px; border-radius: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
          h1 { margin-top: 0; font-size: 24px; }
          p { font-size: 15px; line-height: 1.6; }
          a { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 16px; transition: background 0.2s; }
          a:hover { background: #059669; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Docs Playground API Server Live</h1>
          <p>Backend API service is running on <strong>Port 5005</strong>.</p>
          <p style="opacity: 0.85; font-size: 14px;">To access the AI Summarizer, OCR Extractor, ATS Checker, and AI Detector UI, launch the frontend app below:</p>
          <a href="http://localhost:3000">Open Web Application (localhost:3000)</a>
        </div>
      </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Docs Playground Agent API', timestamp: new Date().toISOString() });
});

// Start Server for local development / Export for Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Docs Playground Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
