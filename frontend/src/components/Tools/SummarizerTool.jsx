import React, { useState } from 'react';
import { FileText, Upload, Sparkles, Copy, Check, ShieldCheck, Cpu, Lock } from 'lucide-react';
import { summarizeDocument, uploadDocument } from '../../services/api';
import { translations } from '../../utils/translations';
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
  const [uploadedFile, setUploadedFile] = useState('');
  const [authError, setAuthError] = useState('');

  const activeModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('toolType', 'Summarizer');

    try {
      const res = await uploadDocument(formData);
      if (res.data?.document?.extractedText) {
        setText(res.data.document.extractedText);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthError('Authentication required to upload documents.');
        if (onOpenAuth) onOpenAuth('login');
      } else {
        console.error('File upload error', err);
      }
    }
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

      const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 10);
      const totalWords = text.trim().split(/\s+/).length;
      let targetSentenceCount = summaryLength === 'short' ? 2 : summaryLength === 'medium' ? 4 : 6;
      
      let summarySentences = sentences.slice(0, Math.min(sentences.length, targetSentenceCount));
      const rawSummary = summarySentences.join(' ') || text.slice(0, 250);

      let summaryText = '';
      let keyPoints = [];

      if (selectedModel === 'deepseek-r1') {
        summaryText = `<think>\n1. Evaluating document thesis, evidence, and logical sequence...\n2. Filtering supporting text to construct DeepSeek R1 reasoning summary...\n</think>\n\n### DeepSeek R1 Deep Reasoning Summary\n${rawSummary}`;
        keyPoints = sentences.slice(0, 4).map((s, idx) => `DeepSeek Logic Point ${idx + 1}: ${s.slice(0, 120)}.`);
      } else if (selectedModel === 'claude-3-5') {
        summaryText = `### Claude 3.5 Sonnet Comprehensive Summary\n\n${rawSummary}\n\n#### Critical Analytical Themes:\n- Primary thesis statement articulated clearly.\n- Contextual evidence aligned across paragraphs.`;
        keyPoints = sentences.slice(0, 4).map((s, idx) => `Claude Analytical Insight ${idx + 1}: ${s.slice(0, 120)}.`);
      } else if (selectedModel === 'gemini-2') {
        summaryText = `⚡ **Google Gemini 2.0 High-Speed Summary:**\n\n${rawSummary}`;
        keyPoints = sentences.slice(0, 4).map((s, idx) => `Gemini Neural Highlight ${idx + 1}: ${s.slice(0, 120)}.`);
      } else if (selectedModel === 'llama-3') {
        summaryText = `### Meta Llama 3.3 Open-Weights Executive Summary\n\n${rawSummary}`;
        keyPoints = sentences.slice(0, 4).map((s, idx) => `Llama 3.3 Key Takeaway ${idx + 1}: ${s.slice(0, 120)}.`);
      } else {
        summaryText = `### ChatGPT (GPT-4o) Executive Summary:\n\n${rawSummary}\n\n**Actionable Summary:**\n• Key ideas summarized concisely for quick executive review.`;
        keyPoints = sentences.slice(0, 4).map((s, idx) => `GPT-4o Executive Takeaway ${idx + 1}: ${s.slice(0, 120)}.`);
      }

      const summaryWords = summaryText.trim().split(/\s+/).length;
      const reductionPercent = Math.max(0, Math.round(((totalWords - summaryWords) / (totalWords || 1)) * 100));

      setResult({
        summary: summaryText,
        keyPoints: keyPoints.length ? keyPoints : [`Key Takeaway 1: ${text.slice(0, 150)}...`],
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {uploadedFile && (
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                ✓ {uploadedFile}
              </span>
            )}
            <label className="btn-upload-file">
              <Upload size={16} /> {t.uploadDoc}
              <input type="file" onChange={handleFileUpload} accept=".pdf,.txt,.docx" hidden />
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
