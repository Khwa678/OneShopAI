const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const pdfParse = require('pdf-parse');
const { saveDocument, getUserDocuments, deleteDocument } = require('../db');
const { authenticateToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to extract plain text from DOCX buffer without native binary dependencies
function extractDocxText(buffer) {
  try {
    let pos = 0;
    while (pos < buffer.length - 30) {
      if (buffer.readUInt32LE(pos) === 0x04034b50) { // Local file header signature
        const compMethod = buffer.readUInt16LE(pos + 8);
        const compSize = buffer.readUInt32LE(pos + 18);
        const nameLen = buffer.readUInt16LE(pos + 26);
        const extraLen = buffer.readUInt16LE(pos + 28);
        const filename = buffer.toString('utf8', pos + 30, pos + 30 + nameLen);
        
        const dataStart = pos + 30 + nameLen + extraLen;
        if (filename === 'word/document.xml') {
          let xmlContent = '';
          const compressedData = buffer.slice(dataStart, dataStart + compSize);
          if (compMethod === 8) {
            xmlContent = zlib.inflateRawSync(compressedData).toString('utf8');
          } else if (compMethod === 0) {
            xmlContent = compressedData.toString('utf8');
          }
          if (xmlContent) {
            const paragraphs = xmlContent.split(/<\/w:p>/);
            const textLines = paragraphs.map(p => {
              const matches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
              if (!matches) return '';
              return matches.map(m => m.replace(/<[^>]+>/g, '')).join('');
            }).filter(line => line.trim().length > 0);
            return textLines.join('\n');
          }
        }
        pos = dataStart + compSize;
      } else {
        pos++;
      }
    }
  } catch (err) {
    console.error('Docx extraction notice:', err.message);
  }
  return '';
}

// Helper to clean up formatting & non-printable artifacts
function fixFragmentedSpaces(text) {
  if (!text || typeof text !== 'string') return '';

  let clean = text.replace(/[\uFFFC\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
  clean = clean.replace(/\.\s+(pdf|txt|docx|doc)/gi, '.$1');
  clean = clean.replace(/[ \t]+/g, ' ');
  clean = clean.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return clean;
}

// Setup file upload directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15 MB limit
});

// Upload Document API
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, filename, mimetype, size, path: filePath } = req.file;
    const lowerName = originalname.toLowerCase();
    let extractedText = '';

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '';

    if (mimetype.startsWith('image/')) {
      if (apiKey) {
        try {
          const fileBuffer = fs.readFileSync(filePath);
          const base64Data = fileBuffer.toString('base64');
          const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
          for (const m of models) {
            try {
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{
                    parts: [
                      { inline_data: { mime_type: mimetype, data: base64Data } },
                      { text: 'Perform high-precision OCR on this uploaded document image. Return ONLY the raw extracted text.' }
                    ]
                  }]
                }),
                signal: AbortSignal.timeout(6000)
              });
              if (response.ok) {
                const data = await response.json();
                extractedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (extractedText) break;
              }
            } catch (err) {
              // Try next model
            }
          }
        } catch (e) {
          console.error('Gemini image upload OCR error:', e.message);
        }
      }
      if (!extractedText) {
        extractedText = `[Scanned Document Image: ${originalname}]\nUploaded image content ready for AI analysis.`;
      }
    } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || mimetype.includes('wordprocessingml')) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        extractedText = extractDocxText(fileBuffer);
      } catch (err) {
        console.error('DOCX parsing error:', err.message);
      }
      if (!extractedText) {
        // Fallback for docx text reading
        try {
          const rawBuf = fs.readFileSync(filePath);
          const rawStr = rawBuf.toString('utf8');
          const matches = rawStr.match(/[\x20-\x7E]{4,}/g);
          if (matches) extractedText = matches.join(' ');
        } catch (e) {}
      }
    } else if (mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const parsed = await pdfParse(dataBuffer);
        extractedText = parsed.text ? parsed.text.trim() : '';
      } catch (err) {
        console.log('PDF Parse notice:', err.message);
      }
    } else if (mimetype.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.csv') || lowerName.endsWith('.json')) {
      extractedText = fs.readFileSync(filePath, 'utf8');
    }

    // Apply space & newline cleanup
    extractedText = fixFragmentedSpaces(extractedText);

    if (!extractedText) {
      extractedText = `[Uploaded File: ${originalname}]\nFile processed. Proceeding to AI legal agreement analysis.`;
    }

    const userId = req.user ? req.user.id : 'guest';
    const savedDoc = saveDocument({
      userId,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      extractedText,
      toolType: req.body.toolType || 'upload'
    });

    return res.status(201).json({
      message: 'File uploaded and parsed successfully!',
      document: savedDoc
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Failed to process file upload.' });
  }
});

// Get Document History for User
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    const docs = getUserDocuments(userId);
    return res.json({ documents: docs });
  } catch (error) {
    console.error('Get docs error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// Delete Document
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    const success = deleteDocument(req.params.id, userId);
    if (success) {
      return res.json({ message: 'Document deleted successfully.' });
    }
    return res.status(404).json({ error: 'Document not found or unauthorized.' });
  } catch (error) {
    console.error('Delete doc error:', error);
    return res.status(500).json({ error: 'Failed to delete document.' });
  }
});

module.exports = router;

