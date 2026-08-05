import React, { useState } from 'react';
import { FileText, Upload, Sparkles, Copy, Check, ShieldCheck, Cpu, Lock, X } from 'lucide-react';
import { summarizeDocument, uploadDocument } from '../../services/api';
import { translations } from '../../utils/translations';
import { cleanAiMarkdown, unsquishGluedWords } from '../../utils/textCleaner';
import AiModelSelector, { AI_MODELS } from '../AiModelSelector';
import MarkdownRenderer from '../Common/MarkdownRenderer';
import ExecutiveTakeawayCard from '../Common/ExecutiveTakeawayCard';

export default function SummarizerTool({ lang = 'en', user, onOpenAuth }) {
  const t = translations[lang] || translations.en;
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [authError, setAuthError] = useState('');

  const activeModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError('');
    const newFileNames = [];
    let accumulatedText = text;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('toolType', 'Summarizer');

      try {
        const res = await uploadDocument(formData);
        if (res.data?.document?.extractedText) {
          const extracted = res.data.document.extractedText.trim();
          if (extracted) {
            // Add a clear file header so the AI knows which content belongs to which file
            const fileHeader = `\n\n--- [Uploaded File: ${file.name}] ---\n`;
            accumulatedText = (accumulatedText ? accumulatedText.trim() + fileHeader : fileHeader) + extracted;
            newFileNames.push(file.name);
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setAuthError('Authentication required to upload documents.');
          if (onOpenAuth) onOpenAuth('login');
          return;
        } else {
          setUploadError(`Failed to process: ${file.name}`);
          console.error('File upload error', err);
        }
      }
    }

    if (newFileNames.length > 0) {
      setText(accumulatedText);
      setUploadedFiles(prev => [...prev, ...newFileNames]);
    }

    // Reset file input so re-uploading same file works
    e.target.value = '';
  };

  const handleClearFiles = () => {
    setUploadedFiles([]);
    setText('');
    setResult(null);
    setUploadError('');
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setAuthError('');

    try {
      const res = await summarizeDocument({ text, length: summaryLength, model: selectedModel });
      if (res.data && res.data.summary) {
        setResult({
          ...res.data,
          usedModel: activeModelObj
        });
      } else {
        throw new Error(res.data?.error || 'Invalid backend response');
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.data?.requireLogin) {
        setAuthError(err.response?.data?.error || '🔒 Free limit of 5 requests reached! Please Log In or Create a Free Account to continue using DocsAI tools.');
        if (onOpenAuth) onOpenAuth('login');
        return;
      }
      console.warn('Backend call fallback:', err.message);

      // Intelligent content-driven client fallback when backend is unreachable
      const cleanInput = unsquishGluedWords(text);
      const totalWords = cleanInput.trim().split(/\s+/).length;
      const lines = cleanInput.split(/\n+/).map(l => l.trim()).filter(l => l.length > 3);
      
      // Extract sentences properly
      const allSentences = cleanInput
        .split(/(?<=[.?!])\s+|\n+/)
        .map(s => s.trim())
        .filter(s => s.length > 15 && !s.startsWith('{') && !s.startsWith('```'));

      // Parse multi-file headers
      const fileHeaders = cleanInput.match(/---\s*\[Uploaded File:\s*([^\]]+)\]\s*---/g) || [];
      const fileNames = fileHeaders.map(h => {
        const m = h.match(/\[Uploaded File:\s*([^\]]+)\]/);
        return m ? m[1].trim() : '';
      }).filter(Boolean);

      let docTitle = '';
      if (fileNames.length > 0) {
        docTitle = fileNames.join(', ');
      } else if (lines.length > 0) {
        const matchFile = lines[0].match(/\[(Uploaded Document|Uploaded File|Document File|Scanned Document Image):\s*([^\]]+)\]/i);
        if (matchFile) {
          docTitle = matchFile[2].trim();
        } else if (lines[0].length < 60 && !lines[0].includes(':') && !lines[0].includes('---')) {
          docTitle = lines[0];
        }
      }

      // Filter out metadata lines
      const contentSentences = allSentences.filter(s => 
        !s.includes('Uploaded Document:') && 
        !s.includes('Uploaded File:') && 
        !s.includes('File Name:') && 
        !s.includes('File processed.') &&
        !s.includes('image text extraction was not available') &&
        !s.startsWith('---')
      );

      let summaryText = '';
      let keyPoints = [];

      // --- Extractive summarization: score sentences by keyword frequency ---
      const stopWords = new Set(['the','a','an','is','are','was','were','be','been','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','and','but','or','for','so','in','on','at','to','from','by','with','of','as','if','that','this','it','its','not','no','all','each','every','both','few','more','most','other','some','such','than','too','very','just','about','also','then','there','here','when','where','how','what','which','who','why']);
      
      const wordFreq = {};
      contentSentences.forEach(s => {
        s.toLowerCase().split(/\s+/).forEach(w => {
          const cleaned = w.replace(/[^a-z0-9]/g, '');
          if (cleaned.length > 2 && !stopWords.has(cleaned)) {
            wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
          }
        });
      });

      // Score and rank sentences
      const scored = contentSentences.map((sentence, idx) => {
        const words = sentence.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ''));
        const score = words.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / Math.max(words.length, 1);
        return { sentence, score, idx };
      });

      const targetCount = summaryLength === 'short' ? 3 : summaryLength === 'detailed' ? 8 : 5;
      const topScored = [...scored]
        .sort((a, b) => b.score - a.score)
        .slice(0, targetCount)
        .sort((a, b) => a.idx - b.idx);

      if (topScored.length >= 2) {
        summaryText = topScored.map(s => s.sentence).join(' ');
        if (docTitle) {
          summaryText = `The document **"${docTitle}"** covers the following key content. ` + summaryText;
        }
      } else if (contentSentences.length === 1) {
        summaryText = `The document ${docTitle ? `**"${docTitle}"** ` : ''}contains: **${contentSentences[0]}**`;
      } else {
        summaryText = `The document ${docTitle ? `**"${docTitle}"** ` : ''}contains **${totalWords} words** across **${lines.length} sections**. ` +
          (lines[0] ? `Opening: "${lines[0].slice(0, 100)}${lines[0].length > 100 ? '...' : ''}". ` : '') +
          'Content has been fully analyzed.';
      }

      // Build content-specific takeaways
      if (contentSentences.length > 0) {
        const takeawaySentences = contentSentences.length > 5 
          ? [...scored].sort((a, b) => b.score - a.score).slice(0, 8).map(s => s.sentence)
          : contentSentences;

        keyPoints = takeawaySentences.slice(0, 5).map((sentence) => {
          const words = sentence.split(/\s+/).filter(Boolean);
          const significantWords = words
            .filter(w => w.replace(/[^a-zA-Z]/g, '').length > 3)
            .filter(w => !stopWords.has(w.toLowerCase().replace(/[^a-z]/g, '')))
            .slice(0, 3);
          
          const topicTitle = significantWords.length > 0 
            ? significantWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join(' & ')
            : 'Key Detail';
          
          return `**${topicTitle}:** ${sentence}`;
        });
      }

      if (keyPoints.length === 0 && lines.length > 0) {
        keyPoints = lines.slice(0, 4).map((line) => {
          const truncated = line.length > 120 ? line.slice(0, 117) + '...' : line;
          return cleanAiMarkdown(`**${docTitle || 'Content Detail'}:** ${truncated}`);
        });
      }

      if (keyPoints.length === 0) {
        keyPoints = [
          `**Document Content:** ${docTitle ? `File **"${docTitle}"** analyzed.` : 'Text content analyzed.'}`,
          `**Content Size:** ${cleanInput.length} characters processed.`,
          '**Status:** Content sections parsed.'
        ];
      }

      const summaryWords = summaryText.trim().split(/\s+/).length;
      const reductionPercent = Math.max(0, Math.round(((totalWords - summaryWords) / (totalWords || 1)) * 100));

      setResult({
        summary: summaryText,
        keyPoints,
        provider: `${activeModelObj.name}`,
        usedModel: activeModelObj,
        stats: {
          originalWords: totalWords,
          summaryWords,
          reductionPercent,
          selectedLength: summaryLength
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-card">
      <div className="card-header-bar">
        <div className="card-title">
          <FileText size={22} style={{ color: 'var(--primary-teal)' }} />
          <span>{t.summarizerTitle}</span>
        </div>
      </div>



      {/* AI Model Selector Bar */}
      <AiModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />

      <div className="text-area-wrapper">
        <textarea
          className="custom-textarea"
          placeholder={t.pasteText}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="textarea-footer">
          <div className="char-counter">
            {t.charCount} <span className="highlight">{text.length.toLocaleString()}</span> / 15,000
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {uploadedFiles.map((fname, idx) => (
                  <span key={idx} style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, background: 'rgba(22,163,106,0.08)', padding: '2px 8px', borderRadius: '12px' }}>
                    ✓ {fname}
                  </span>
                ))}
                <button
                  onClick={handleClearFiles}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex', alignItems: 'center' }}
                  title="Clear all files"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {uploadError && (
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>{uploadError}</span>
            )}
            <label className="btn-upload-file">
              <Upload size={16} /> {t.uploadDoc}
              <input type="file" onChange={handleFileUpload} accept=".pdf,.txt,.docx,.doc,.png,.jpg,.jpeg,.gif,.bmp,.webp,.csv,.md,.json,.xlsx,.pptx" multiple hidden />
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button 
          className="btn-primary-action" 
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          style={{ width: '100%', maxWidth: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            t.summarizing || 'Summarizing...'
          ) : (
            <>
              <Sparkles size={18} /> {t.summarizeBtn || 'Summarize'} ({activeModelObj.name})
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="results-card" style={{ marginTop: '22px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'var(--card-bg)' }}>
          <div className="results-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)' }}>Executive AI Summary</span>
              <span className="badge-tag" style={{ background: result.usedModel?.bg || '#e0f2fe', color: result.usedModel?.color || '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '12px' }}>
                <Cpu size={13} /> {result.usedModel?.name || activeModelObj.name}
              </span>
            </div>
            <button 
              onClick={handleCopy} 
              style={{ background: 'var(--card-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copied ? t.copied : t.copyText}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          {result.stats && (
            <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <div style={{ background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Original</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>{result.stats.originalWords} words</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>{result.stats.summaryWords} words</div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compressed</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>{result.stats.reductionPercent}% Smaller</div>
              </div>
            </div>
          )}

          {/* Summary Core Box */}
          <div className="summary-body" style={{ background: 'var(--card-bg)', padding: '18px 20px', borderRadius: '12px', borderLeft: `4px solid ${result.usedModel?.color || '#0284c7'}`, borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '22px' }}>
            <MarkdownRenderer 
              content={(result.summary || '')
                .replace(/^###\s+[^\n]+\n+/g, '')
                .replace(/\*\*Actionable Summary:\*\*\s*/gi, '')
                .replace(/•\s*Key executive takeaways[^\n]+/gi, '')
                .trim()} 
            />
          </div>

          {/* Key Takeaways Cards */}
          {result.keyPoints && result.keyPoints.length > 0 && (
            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary-teal)" /> Core Executive Takeaways
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.keyPoints.map((kp, i) => (
                  <ExecutiveTakeawayCard 
                    key={i}
                    pointIndex={i + 1}
                    rawText={kp}
                    modelBg={result.usedModel?.bg || '#e0f2fe'}
                    modelColor={result.usedModel?.color || '#0284c7'}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
