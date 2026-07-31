const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const aiRoutes = require('./routes/ai');
const blogRoutes = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 5005;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);
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
