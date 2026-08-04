const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');

require('dotenv').config();

// Configure Google Public DNS for MongoDB Atlas SRV record resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // ignore if not supported
}

const dbFilePath = path.join(__dirname, process.env.DATA_FILE || 'data_store.json');

// MongoDB Atlas Mongoose Connection
const mongoURI = process.env.MONGODB_URI;
let isMongoConnected = false;

if (mongoURI) {
  mongoose.connect(mongoURI, { family: 4 })
    .then(() => {
      isMongoConnected = true;
      console.log('🍃 MongoDB Atlas Database Connected Successfully!');
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB Atlas Connection Warning:', err.message);
      console.log('📦 Falling back to local JSON data store');
    });
}

// Initial schema template
const initialBlogs = [
  {
    id: "blog_1",
    title: "10 Ways Students Can Save Time Using AI Summarizers",
    excerpt: "Discover how AI document summarizers help students process textbooks, research papers, lecture notes, exam prep, and PDFs in a fraction of the time.",
    category: "Student & Study",
    readTime: "6 min read",
    date: "July 2026",
    author: "DocsAI Academic Team",
    tool: "summarizer",
    content: `### Introduction
In today's fast-paced academic environment, students are overwhelmed with hundreds of pages of reading material every week. From dense academic research papers to lengthy textbook chapters, keeping up with coursework can feel like a full-time job. AI Summarizers have emerged as the ultimate study productivity tool for students worldwide.

Here are 10 proven ways students can save hours every week using AI summarization:

---

#### 1. Assignment Summaries
When starting a new assignment or essay prompt, students often spend hours reading background references. An AI summarizer extracts the core thesis, supporting arguments, and key statistics from assignment briefs and reference materials in seconds.

#### 2. Research Papers & Literature Reviews
Academic papers are notoriously filled with complex jargon, dense methodologies, and long introductions. By feeding PDFs of research papers into an AI summarizer, students can immediately understand the hypothesis, methodology, results, and conclusion before deciding whether to read the full text.

#### 3. Class & Lecture Notes
Typed or transcribed lecture notes can easily run into thousands of wordy bullet points. AI summarizers reorganize messy notes into neat, structured outlines categorized by topic, key terms, and definitions.

#### 4. Exam Preparation & Quick Revision
During finals week, time is critical. AI summarizers help transform 100-page course packs into concise flashcard-style study guides, high-yield summary sheets, and practice key points for fast revision.

#### 5. Books & Literature Analysis
Assigned 500-page textbooks or classic novels? AI summarizers generate chapter-by-chapter breakdowns, character arc summaries, major themes, and symbolic analyses so you never miss an important detail.

#### 6. Processing Heavy PDF Documents
Textbook PDFs and lecture slides are often unwieldy. Using document-level OCR and summarization tools like DocsAI, students can upload 50+ page PDFs and extract actionable takeaways instantaneously.

#### 7. Group Project Collaboration
Summarize group chat logs, shared brainstorm documents, and meeting notes to keep all team members aligned on deadlines and task assignments.

#### 8. Foreign Language Study Materials
Students studying foreign languages or reading international research can translate and summarize non-English documents simultaneously into clean, understandable bullet points.

#### 9. Lab Reports & Experimental Findings
Extract key hypotheses, equipment lists, procedure steps, and experimental results from long lab manuals and technical specs.

#### 10. Rapid Citation & Bibliography Building
Quickly identify key quotes, author arguments, and statistical evidence needed to support your citations and references in research papers.

---

### Conclusion
By integrating AI summarizers like DocsAI into your daily workflow, you can reduce reading time by up to 70% while improving retention and academic performance.`
  },
  {
    id: "blog_2",
    title: "Best AI Summarizer in 2026: ChatGPT vs Gemini vs Claude vs DocsAI",
    excerpt: "A comprehensive side-by-side comparison of top AI summarization tools in 2026 evaluating accuracy, PDF support, speed, ATS/OCR capabilities, and cost.",
    category: "Tool Comparison",
    readTime: "8 min read",
    date: "July 2026",
    author: "AI Benchmark Labs",
    tool: "summarizer",
    content: `### Comparing Top AI Summarizer Tools in 2026
Finding the right AI summarizer is crucial for students, researchers, and professionals who work with heavy documentation daily. In 2026, four major platforms lead the market: **ChatGPT**, **Google Gemini**, **Anthropic Claude**, and **DocsAI**.

Below is an in-depth breakdown of how each tool performs across accuracy, file handling, specialized document workflows, and accessibility.

---

### 1. ChatGPT (OpenAI GPT-4o)
* **Strengths:** High conversational flexibility, strong reasoning, and wide language support.
* **Weaknesses:** File size upload limits on free tiers, generic output formatting requiring heavy prompt tweaking, and subscription costs ($20/mo).
* **Best For:** General brainstorming and conversational QA.

### 2. Google Gemini (Gemini 1.5/2.0 Pro)
* **Strengths:** Massive context window (up to 1M-2M tokens) and native integration with Google Docs/Drive.
* **Weaknesses:** Occasional hallucinations on fine legal or technical clauses; web interface can feel cluttered.
* **Best For:** Processing extremely long transcripts and Google Ecosystem users.

### 3. Anthropic Claude (Claude 3.5 Sonnet)
* **Strengths:** Superior natural prose writing quality, nuanced tone analysis, and excellent code reading.
* **Weaknesses:** Strict hourly message limits and lack of built-in OCR scanning or document template export tools.
* **Best For:** Creative writing synthesis and deep editorial review.

### 4. DocsAI (All-in-One Document AI Platform)
* **Strengths:** Dedicated suite built specifically for document processing! Features instant AI summarization with custom length controls (Short, Medium, Detailed), OCR optical character extraction, ATS resume checker, Agreement Summarizer, and AI Text Humanizer. No token caps for basic tiers.
* **Weaknesses:** Focused purely on document and text workflows rather than open-ended chatbot conversational games.
* **Best For:** Students, legal reviewers, job seekers, and researchers needing reliable, structured document results.

---

### Comparison Breakdown Matrix

| Feature / Metric | ChatGPT (GPT-4o) | Google Gemini | Anthropic Claude | DocsAI |
| :--- | :--- | :--- | :--- | :--- |
| **PDF & File Upload** | ⚠️ Limited Free | ✅ Supported | ⚠️ Limited | ✅ Full Native Support |
| **Built-in OCR Scanner** | ❌ No | ❌ No | ❌ No | ✅ Included |
| **Custom Summary Length**| ⚠️ Via Prompts | ⚠️ Via Prompts | ⚠️ Via Prompts | ✅ 1-Click Controls |
| **ATS Resume Checker** | ❌ No | ❌ No | ❌ No | ✅ Built-in |
| **AI Humanizer Tool** | ❌ No | ❌ No | ❌ No | ✅ Built-in |
| **Speed & Accuracy** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Pricing** | $20/mo Pro | $20/mo Advanced| $20/mo Pro | 🆓 Free Tier Available |

---

### Final Verdict
While ChatGPT, Gemini, and Claude are powerful general-purpose LLMs, **DocsAI** stands out as the #1 dedicated document intelligence platform in 2026 for users who require specialized tools like OCR text extraction, custom summary length tuning, agreement summarization, and ATS score analysis under one unified roof.`
  },
  {
    id: "blog_3",
    title: "How AI Document Summarization Saves Hours of Contract Review",
    excerpt: "Learn how modern NLP models extract key clauses, non-disclosure requirements, and executive takeaways from 50-page legal contracts in seconds.",
    category: "Document AI",
    readTime: "4 min read",
    date: "July 2026",
    author: "Docs AI Research Team",
    tool: "agreement",
    content: `### Executive Summary
Reviewing 50-page commercial contracts, non-disclosure agreements, and employment offers can take legal teams and business owners hours of tedious reading. AI document summarizers cut this time down to seconds by identifying critical clauses, liabilities, and termination terms automatically.

### Key Benefits for Legal & Business Workflows
1. **Instant Risk Highlights**: Automatically surface indemnification, non-compete, and confidentiality obligations.
2. **Clause Categorization**: Group sections into payment terms, warranties, and force majeure clauses.
3. **Plain English Explanations**: Translate dense legalese into plain language summaries for fast decision-making.`
  },
  {
    id: "blog_4",
    title: "Mastering ATS Resumes: How to Pass Automated Screening",
    excerpt: "Discover top formatting secrets, keyword density strategies, and section order optimization to get your resume past HR bots and noticed by recruiters.",
    category: "Career & ATS",
    readTime: "5 min read",
    date: "July 2026",
    author: "Career Engineering Guild",
    tool: "ats",
    content: `### Understanding Applicant Tracking Systems (ATS)
Over 98% of Fortune 500 companies use ATS software to filter resume applications before a human recruiter ever views them. 

### Top Strategies to Pass ATS Screening
- **Use Standard Section Headers**: Avoid creative titles like 'My Journey'; use standard titles like 'Work Experience' and 'Education'.
- **Match Job Keyword Density**: Align your technical skills and action verbs with the job description keywords.
- **Clean Formatting**: Avoid multi-column layouts, tables, or embedded images that confuse parser software.`
  },
  {
    id: "blog_5",
    title: "How Neural OCR Extracts Editable Text from Scanned PDFs & Images",
    excerpt: "Discover how Optical Character Recognition (OCR) combined with multi-language AI models turns scanned PDFs, contracts, and images into clean, editable text.",
    category: "Document AI",
    readTime: "5 min read",
    date: "July 2026",
    author: "Docs Vision Research Team",
    tool: "ocr",
    content: `### The Evolution of Optical Character Recognition (OCR)
Legacy OCR software often struggled with blurry scans, handwriting, or skewed document photos. Next-generation Neural OCR combines optical pattern recognition with LLM context analysis to recognize characters with over 99% accuracy.

### Key Capabilities of Neural OCR
1. **Multi-Language Support**: Extract text seamlessly across 50+ global scripts including English, Spanish, French, German, Hindi, Chinese, and Japanese.
2. **Layout Preservation**: Retain structured paragraph boundaries, bullet lists, and tables without scrambling content order.
3. **Scanned PDF Parsing**: Instantly convert non-searchable image-based PDFs into fully searchable, editable text buffers.`
  },
  {
    id: "blog_6",
    title: "Converting AI Text into 100% Organic Writing with AI Text Humanizer",
    excerpt: "Learn how AI Text Humanizer strips out robotic ChatGPT phrasing, balances sentence perplexity, and generates authentic, human-sounding content.",
    category: "AI Safety",
    readTime: "6 min read",
    date: "July 2026",
    author: "Docs AI Ethics Lab",
    tool: "humanizer",
    content: `### Why Does AI Text Sound Robotic?
Large Language Models like ChatGPT and Gemini share distinct writing patterns: overusing transition words like 'furthermore' or 'delve into', uniform sentence lengths, and repetitive meta-talk ('As an AI assistant...').

### How AI Text Humanizer Transforms AI Output
- **Rhythm & Sentence Burstiness**: Mixes short punchy statements with longer complex sentences to mirror natural human writing habits.
- **Vocabulary Diversity**: Replaces repetitive AI buzzwords with conversational synonyms suited for your chosen tone (Professional, Conversational, Casual, Academic).
- **Removing Conversational Noise**: Automatically cleans out AI intro/outro boilerplate phrases.`
  }
];

const initialData = {
  users: [],
  documents: [],
  aiLogs: [],
  blogs: initialBlogs
};

// Initialize file if not exists
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2));
}

function readDB() {
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.blogs || parsed.blogs.length === 0) {
      parsed.blogs = initialBlogs;
      fs.writeFileSync(dbFilePath, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB, resetting:', err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// User Helpers
function findUserByEmail(email) {
  const db = readDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  const db = readDB();
  return db.users.find(u => u.id === id);
}

function createUser(user) {
  const db = readDB();
  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: user.name,
    email: user.email.toLowerCase(),
    password: user.password, // hashed
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

function updateUserPassword(email, newPasswordHashed) {
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.password = newPasswordHashed;
    delete user.resetToken;
    delete user.resetTokenExpiry;
    writeDB(db);
    return true;
  }
  return false;
}

function saveResetToken(email, token, expiry) {
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    writeDB(db);
    return true;
  }
  return false;
}

function findUserByResetToken(token) {
  const db = readDB();
  return db.users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());
}

// Document Helpers
function saveDocument(doc) {
  const db = readDB();
  const newDoc = {
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId: doc.userId || 'guest',
    filename: doc.filename,
    originalName: doc.originalName,
    mimeType: doc.mimeType,
    size: doc.size,
    extractedText: doc.extractedText || '',
    toolType: doc.toolType || 'upload',
    createdAt: new Date().toISOString()
  };
  db.documents.unshift(newDoc);
  writeDB(db);
  return newDoc;
}

function getUserDocuments(userId) {
  const db = readDB();
  return db.documents.filter(d => d.userId === userId || d.userId === 'guest');
}

function deleteDocument(id, userId) {
  const db = readDB();
  const initialLength = db.documents.length;
  db.documents = db.documents.filter(d => d.id !== id);
  if (db.documents.length < initialLength) {
    writeDB(db);
    return true;
  }
  return false;
}

// AI Result Log Helpers
function saveAiLog(log) {
  const db = readDB();
  const newLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId: log.userId || 'guest',
    tool: log.tool,
    inputLength: log.inputLength,
    resultSummary: log.resultSummary,
    createdAt: new Date().toISOString()
  };
  db.aiLogs.unshift(newLog);
  writeDB(db);
  return newLog;
}

// Blog Helpers
function getBlogs() {
  const db = readDB();
  const blogs = db.blogs || initialBlogs;
  return blogs.map(b => ({
    ...b,
    verified: b.verified !== undefined ? b.verified : true,
    status: b.status || (b.verified === false ? 'pending' : 'approved')
  }));
}

function createBlog(blog) {
  const db = readDB();
  if (!db.blogs) db.blogs = [...initialBlogs];
  const newBlog = {
    id: 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    title: blog.title,
    excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : ''),
    category: blog.category || 'General',
    readTime: blog.readTime || '3 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    author: blog.author || 'Community Author',
    tool: blog.tool || 'summarizer',
    content: blog.content || '',
    verified: false,
    status: 'pending'
  };
  db.blogs.unshift(newBlog);
  writeDB(db);
  return newBlog;
}

function verifyBlog(id) {
  const db = readDB();
  if (!db.blogs) db.blogs = [...initialBlogs];
  const blog = db.blogs.find(b => b.id === id);
  if (blog) {
    blog.verified = true;
    blog.status = 'approved';
    writeDB(db);
    return blog;
  }
  return null;
}

function deleteBlog(id) {
  const db = readDB();
  if (!db.blogs) return false;
  const initialLen = db.blogs.length;
  db.blogs = db.blogs.filter(b => b.id !== id);
  if (db.blogs.length < initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  saveDocument,
  getUserDocuments,
  deleteDocument,
  saveAiLog,
  getBlogs,
  createBlog,
  verifyBlog,
  deleteBlog
};

