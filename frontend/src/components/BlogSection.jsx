import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, ArrowLeft, Clock, Plus, X, User, Tag, Sparkles, CheckCircle2, FileText, Send, ShieldCheck, AlertTriangle, Trash2, Check } from 'lucide-react';
import { getBlogs, createBlogPost, verifyBlogPost, deleteBlogPost } from '../services/api';
import { translations } from '../utils/translations';

const DEFAULT_POSTS = [
  {
    id: "blog_pdf_compress",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt: "Large PDF files can be difficult to upload, share, or store. Compressing a PDF reduces its file size while maintaining good quality, making it easier to send via email, upload to websites, or save storage space.",
    category: "PDF Guides",
    readTime: "5 min read",
    date: "July 2026",
    author: "Shruti Kushwaha",
    tool: "summarizer",
    content: `### How to Compress a PDF Without Losing Quality

Large PDF files can be difficult to upload, share, or store. Compressing a PDF reduces its file size while maintaining good quality, making it easier to send via email, upload to websites, or save storage space. Here's how you can compress a PDF without losing quality.

---

#### 1. Why Compress Your PDF?
- **Faster Email Sharing:** Most email providers enforce strict 25MB attachment limits. Compressed PDFs bypass file size limits easily.
- **Quicker Web Uploads:** Compressed documents load faster on application portals, university portals, and cloud drives.
- **Storage Savings:** Save up to 80% disk space on local hard drives and cloud storage.

---

#### 2. Best Practices for Compression
- Use DPI-aware image optimization to maintain crisp text vector layers.
- Remove redundant embedded fonts and duplicate metadata.
- Choose smart loss-less compression algorithms available in Docs Playground.`
  },
  {
    id: "blog_pdf_merge",
    title: "How to Merge PDF Files Online for Free",
    excerpt: "Merging multiple PDF files into one document is a simple way to keep your files organized and easy to share. Whether you're combining reports, invoices, assignments, or scanned documents.",
    category: "PDF Guides",
    readTime: "4 min read",
    date: "July 2026",
    author: "Shruti Kushwaha",
    tool: "summarizer",
    content: `### How to Merge PDF Files Online for Free

Merging multiple PDF files into one document is a simple way to keep your files organized and easy to share. Whether you're combining reports, invoices, assignments, or scanned documents, an online PDF merger can save time and improve productivity.

---

#### Step-by-Step Guide:
1. Select and upload your PDF files to Docs Playground.
2. Drag and reorder pages into your desired sequence.
3. Click **Merge PDFs** and download your single combined document instantly.`
  },
  {
    id: "blog_pdf_word",
    title: "How to Convert PDF to Word Without Losing Formatting",
    excerpt: "Converting a PDF to a Word document makes it easier to edit text, update content, and reuse information while preserving original fonts, tables, and layouts.",
    category: "PDF Guides",
    readTime: "5 min read",
    date: "July 2026",
    author: "Shruti Kushwaha",
    tool: "summarizer",
    content: `### How to Convert PDF to Word Without Losing Formatting

Converting a PDF to a Word document makes it easier to edit text, update content, and reuse information. Whether you're working with reports, resumes, invoices, or study materials, a PDF to Word converter helps you quickly transform your files while preserving the original layout.

---

#### Key Advantages:
- Retains original font typography and heading structures.
- Preserves embedded tables, cell formatting, and alignment.
- Enables direct editing in Microsoft Word or Google Docs.`
  },
  {
    id: "blog_pdf_ocr",
    title: "How to OCR a Scanned PDF",
    excerpt: "Scanned PDFs often contain images of text instead of editable text. OCR (Optical Character Recognition) converts these scanned pages into searchable and editable text.",
    category: "OCR & Scanning",
    readTime: "4 min read",
    date: "July 2026",
    author: "Shruti Kushwaha",
    tool: "ocr",
    content: `### How to OCR a Scanned PDF

Scanned PDFs often contain images of text instead of editable text. OCR (Optical Character Recognition) converts these scanned pages into searchable and editable text, making it easier to edit, copy, and organize your documents.

---

#### Why Use OCR?
- Convert non-searchable scanned image PDFs into searchable digital text.
- Copy and paste text directly from old scanned books or receipts.
- Translate scanned documents into over 50 global languages.`
  },
  {
    id: "blog_1",
    title: "10 Ways Students Can Save Time Using AI Summarizers",
    excerpt: "Discover how AI document summarizers help students process textbooks, research papers, lecture notes, exam prep, and PDFs in a fraction of the time.",
    category: "Student & Study",
    readTime: "6 min read",
    date: "July 2026",
    author: "Docs Playground Academic Team",
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
Textbook PDFs and lecture slides are often unwieldy. Using document-level OCR and summarization tools like Docs Playground, students can upload 50+ page PDFs and extract actionable takeaways instantaneously.

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
By integrating AI summarizers like Docs Playground into your daily workflow, you can reduce reading time by up to 70% while improving retention and academic performance.`
  },
  {
    id: "blog_2",
    title: "Best AI Summarizer in 2026: ChatGPT vs Gemini vs Claude vs Docs Playground",
    excerpt: "A comprehensive side-by-side comparison of top AI summarization tools in 2026 evaluating accuracy, PDF support, speed, ATS/OCR capabilities, and cost.",
    category: "Tool Comparison",
    readTime: "8 min read",
    date: "July 2026",
    author: "AI Benchmark Labs",
    tool: "summarizer",
    content: `### Comparing Top AI Summarizer Tools in 2026
Finding the right AI summarizer is crucial for students, researchers, and professionals who work with heavy documentation daily. In 2026, four major platforms lead the market: **ChatGPT**, **Google Gemini**, **Anthropic Claude**, and **Docs Playground**.

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

### 4. Docs Playground (All-in-One Document AI Platform)
* **Strengths:** Dedicated suite built specifically for document processing! Features instant AI summarization with custom length controls (Short, Medium, Detailed), OCR optical character extraction, ATS resume checker, Agreement Summarizer, and AI Text Humanizer. No token caps for basic tiers.
* **Weaknesses:** Focused purely on document and text workflows rather than open-ended chatbot conversational games.
* **Best For:** Students, legal reviewers, job seekers, and researchers needing reliable, structured document results.

---

### Comparison Breakdown Matrix

| Feature / Metric | ChatGPT (GPT-4o) | Google Gemini | Anthropic Claude | Docs Playground |
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
While ChatGPT, Gemini, and Claude are powerful general-purpose LLMs, **Docs Playground** stands out as the #1 dedicated document intelligence platform in 2026 for users who require specialized tools like OCR text extraction, custom summary length tuning, agreement summarization, and ATS score analysis under one unified roof.`
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

export default function BlogSection({ onSelectTool, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [posts, setPosts] = useState(() => DEFAULT_POSTS.map(p => ({ ...p, verified: true, status: 'approved' })));
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(null);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Student & Study');
  const [newAuthor, setNewAuthor] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTool, setNewTool] = useState('summarizer');

  const categories = ['All', 'Pending Review', 'Student & Study', 'Tool Comparison', 'Document AI', 'Career & ATS', 'AI Safety'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      if (res.data && res.data.blogs && res.data.blogs.length > 0) {
        setPosts(res.data.blogs);
      }
    } catch (err) {
      console.log('Using default blog posts');
    }
  };

  const handleVerifyPost = async (postId) => {
    try {
      if (verifyBlogPost) await verifyBlogPost(postId);
    } catch (err) {
      console.log('Verify local fallback');
    }

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, verified: true, status: 'approved' } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, verified: true, status: 'approved' }));
    }
    setNotificationBanner({
      type: 'success',
      text: '✅ Blog post verified and published! It is now live for all users.'
    });
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const handleDeletePost = async (postId) => {
    try {
      if (deleteBlogPost) await deleteBlogPost(postId);
    } catch (err) {
      console.log('Delete local fallback');
    }

    setPosts(prev => prev.filter(p => p.id !== postId));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
    setNotificationBanner({
      type: 'info',
      text: '🗑️ Blog post removed.'
    });
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    const postPayload = {
      title: newTitle.trim(),
      category: newCategory,
      author: newAuthor.trim() || 'Community Member',
      excerpt: newExcerpt.trim() || newContent.substring(0, 140) + '...',
      content: newContent.trim(),
      tool: newTool,
      readTime: `${Math.max(2, Math.ceil(newContent.split(' ').length / 150))} min read`
    };

    let createdPost;
    try {
      const res = await createBlogPost(postPayload);
      if (res.data && res.data.blog) {
        createdPost = res.data.blog;
      } else {
        createdPost = { id: 'blog_' + Date.now(), ...postPayload, date: 'July 2026', verified: false, status: 'pending' };
      }
    } catch (err) {
      createdPost = { id: 'blog_' + Date.now(), ...postPayload, date: 'July 2026', verified: false, status: 'pending' };
    } finally {
      setPosts([createdPost, ...posts]);
      setSubmitting(false);
      setIsPostModalOpen(false);

      // Show Pending Verification Banner Notification
      setNotificationBanner({
        type: 'warning',
        text: '📌 Your blog post has been submitted! It is currently NOT VERIFIED and is waiting for admin verification before public release.'
      });
      setTimeout(() => setNotificationBanner(null), 8000);

      // Reset Form
      setNewTitle('');
      setNewAuthor('');
      setNewExcerpt('');
      setNewContent('');
    }
  };

  const pendingPostsCount = posts.filter(p => p.verified === false || p.status === 'pending').length;

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : activeCategory === 'Pending Review'
      ? posts.filter(p => p.verified === false || p.status === 'pending')
      : posts.filter(p => p.category === activeCategory);

  // Render markdown-like text content neatly
  const renderFormattedContent = (contentString) => {
    if (!contentString) return null;
    const lines = contentString.split('\n');
    let inTable = false;
    let tableRows = [];

    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Check Markdown Table format
      if (trimmed.startsWith('|')) {
        const cells = trimmed.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
        if (trimmed.includes('---')) return null; // Separator row
        return (
          <div key={index} style={{ overflowX: 'auto', margin: '12px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color, #cbd5e1)', borderRadius: '8px', overflow: 'hidden' }}>
              <tbody>
                <tr style={{ background: index < 5 ? '#f1f5f9' : 'transparent', fontWeight: index < 5 ? 700 : 400 }}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '10px 14px', border: '1px solid var(--border-color, #e2e8f0)', fontSize: '13px' }}>
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark, #0f172a)', marginTop: '20px', marginBottom: '10px' }}>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={index} style={{ fontSize: '15px', fontWeight: 700, color: '#4f46e5', marginTop: '16px', marginBottom: '8px' }}>
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('---')) {
        return <hr key={index} style={{ border: 'none', borderTop: '1px dashed var(--border-color, #cbd5e1)', margin: '20px 0' }} />;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', fontSize: '14px', color: 'var(--text-dark, #334155)', lineHeight: '1.6' }}>
            <CheckCircle2 size={16} style={{ color: '#4f46e5', flexShrink: 0, marginTop: '3px' }} />
            <span>{trimmed.replace(/^(\* |- |\d+\. )/, '').replace(/\*\*/g, '')}</span>
          </div>
        );
      }
      if (!trimmed) return <div key={index} style={{ height: '8px' }} />;

      return (
        <p key={index} style={{ fontSize: '14px', color: 'var(--text-dark, #334155)', lineHeight: '1.7', marginBottom: '12px' }}>
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff', paddingBottom: '60px', boxSizing: 'border-box' }}>
      {/* Top Header Navigation Bar */}
      <div style={{
        padding: '18px 40px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>P</div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>Docs Playground • Blogs & Guides</span>
        </div>

        {onSelectTool && (
          <button
            onClick={() => onSelectTool('summarizer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* Notification Banner */}
        {notificationBanner && (
          <div style={{
            background: notificationBanner.type === 'warning' ? '#fffbe6' : notificationBanner.type === 'success' ? '#ecfdf5' : '#f1f5f9',
            border: `1px solid ${notificationBanner.type === 'warning' ? '#fde68a' : notificationBanner.type === 'success' ? '#a7f3d0' : '#cbd5e1'}`,
            color: notificationBanner.type === 'warning' ? '#b45309' : notificationBanner.type === 'success' ? '#065f46' : '#334155',
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {notificationBanner.type === 'warning' ? <AlertTriangle size={20} color="#d97706" /> : <CheckCircle2 size={20} color="#10b981" />}
              <span>{notificationBanner.text}</span>
            </div>
            <X size={18} style={{ cursor: 'pointer' }} onClick={() => setNotificationBanner(null)} />
          </div>
        )}

        {/* Header */}
        <div className="card-header-bar" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                COMMUNITY & KNOWLEDGE BASE
              </span>
            </div>
            <h2 className="card-title" style={{ fontSize: '24px', fontWeight: 800 }}>
              {t.blogsTitle}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
              {t.blogsSub}
            </p>
          </div>

          {/* Post a Blog Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Plus size={18} />
            <span>{t.postBlogBtn}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
          {categories.map(cat => {
            const isPendingCat = cat === 'Pending Review';
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1px solid #4f46e5' : isPendingCat && pendingPostsCount > 0 ? '1px solid #f59e0b' : '1px solid var(--border-color, #cbd5e1)',
                  background: isActive ? '#4f46e5' : isPendingCat && pendingPostsCount > 0 ? '#fef3c7' : 'transparent',
                  color: isActive ? '#ffffff' : isPendingCat && pendingPostsCount > 0 ? '#b45309' : 'var(--text-dark, #334155)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isPendingCat && <AlertTriangle size={14} color={isActive ? '#ffffff' : '#d97706'} />}
                <span>{cat}</span>
                {isPendingCat && (
                  <span style={{
                    background: isActive ? '#ffffff' : '#f59e0b',
                    color: isActive ? '#4f46e5' : '#ffffff',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {pendingPostsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Article Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredPosts.map((post) => {
            const isUnverified = post.verified === false || post.status === 'pending';
            return (
              <article 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                style={{
                  background: isUnverified ? '#fffbe6' : 'var(--light-bg, #f8fafc)',
                  border: isUnverified ? '1px solid #fde68a' : '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                className="blog-card-hover"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px' }}>
                      {post.category}
                    </span>

                    {isUnverified ? (
                      <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> Not Verified
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
                        <Clock size={12} /> {post.readTime}
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark, #0f172a)', marginBottom: '8px', lineHeight: '1.4' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed var(--border-color, #cbd5e1)', fontSize: '12.5px', fontWeight: 700, color: '#4f46e5' }}>
                    <span>{t.readFullArticle}</span>
                    <ArrowRight size={15} />
                  </div>

                  {/* Admin Verification Actions for Unverified Posts */}
                  {isUnverified && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #fde68a', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVerifyPost(post.id); }}
                        style={{
                          flex: 1,
                          background: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                        }}
                      >
                        <ShieldCheck size={15} />
                        <span>Verify & Publish</span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                        title="Reject & Delete Post"
                        style={{
                          background: '#fee2e2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* FULL ARTICLE READER MODAL */}
        {selectedPost && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--card-bg, #ffffff)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Warning Box for Unverified Posts */}
              {(selectedPost.verified === false || selectedPost.status === 'pending') && (
                <div style={{
                  background: '#fffbe6',
                  border: '1px solid #fde68a',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b45309', fontWeight: 700, fontSize: '13.5px' }}>
                    <AlertTriangle size={20} color="#d97706" />
                    <span>This post is <strong>Not Verified</strong>. Admin approval required before public release.</span>
                  </div>
                  <button
                    onClick={() => handleVerifyPost(selectedPost.id)}
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Verify & Publish Now</span>
                  </button>
                </div>
              )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px' }}>
                {selectedPost.category}
              </span>
              <span style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {selectedPost.readTime}
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark, #0f172a)', lineHeight: '1.3', marginBottom: '12px' }}>
              {selectedPost.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
              <User size={15} />
              <span>By <strong>{selectedPost.author}</strong></span>
              <span>•</span>
              <span>{selectedPost.date || 'July 2026'}</span>
            </div>

            {/* Article Content */}
            <div style={{ marginBottom: '32px' }}>
              {renderFormattedContent(selectedPost.content || selectedPost.excerpt)}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              <button
                onClick={() => {
                  setSelectedPost(null);
                  if (onSelectTool) onSelectTool(selectedPost.tool || 'summarizer');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={16} />
                <span>{t.tryTool}</span>
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW BLOG POST MODAL */}
      {isPostModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsPostModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} style={{ color: '#4f46e5' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark, #0f172a)' }}>
                Publish a Community Blog Post
              </h2>
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>
              Share your AI tips, study hacks, tool reviews, or academic summaries with all users!
            </p>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #334155)', marginBottom: '6px' }}>
                  Blog Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How I Summarized 10 Research Papers in 30 Minutes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '14px',
                    background: 'var(--light-bg, #f8fafc)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #334155)', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '13.5px',
                      background: 'var(--light-bg, #f8fafc)'
                    }}
                  >
                    <option value="Student & Study">Student & Study</option>
                    <option value="Tool Comparison">Tool Comparison</option>
                    <option value="Document AI">Document AI</option>
                    <option value="Career & ATS">Career & ATS</option>
                    <option value="AI Safety">AI Safety</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #334155)', marginBottom: '6px' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '14px',
                      background: 'var(--light-bg, #f8fafc)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #334155)', marginBottom: '6px' }}>
                  Short Excerpt / Summary
                </label>
                <input
                  type="text"
                  placeholder="Brief 1-2 sentence overview of your post..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '14px',
                    background: 'var(--light-bg, #f8fafc)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #334155)', marginBottom: '6px' }}>
                  Full Article Content *
                </label>
                <textarea
                  required
                  rows={7}
                  placeholder="Write your article here... You can use headings like ### Section Title or bullet points starting with * or -"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background: 'var(--light-bg, #f8fafc)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14.5px',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Publishing...' : 'Publish Blog Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
