import React, { useState } from 'react';
import { Scale, Upload, ShieldAlert, Check, Sparkles, FileText, Cpu, FileCheck, Lightbulb, AlertTriangle, Calendar, Users, DollarSign, FileCode, RefreshCw, AlertCircle } from 'lucide-react';
import { checkAgreement, uploadDocument } from '../../services/api';
import { translations } from '../../utils/translations';
import AiModelSelector, { AI_MODELS } from '../AiModelSelector';
import MarkdownRenderer from '../Common/MarkdownRenderer';

export default function AgreementTool({ lang = 'en', user, onOpenAuth }) {
  const t = translations[lang] || translations.en;
  const [docText, setDocText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const activeModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('toolType', 'Agreement Summarizer');

    try {
      const res = await uploadDocument(formData);
      if (res.data?.document?.extractedText) {
        setDocText(res.data.document.extractedText);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMessage('Authentication required to upload contract.');
        if (onOpenAuth) onOpenAuth('login');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to upload document. Please paste the contract text below.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCheckAgreement = async () => {
    const textToAnalyze = docText.trim();
    if (!textToAnalyze && !fileName) {
      setErrorMessage('Please enter or upload legal contract text to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMessage('');

    const effectiveText = textToAnalyze || `[Document File: ${fileName}]\nLegal contract uploaded for audit.`;

    try {
      const res = await checkAgreement({ document1: effectiveText, document2: '', model: selectedModel });
      if (res.data) {
        setResult({
          ...res.data,
          usedModel: activeModelObj
        });
      } else {
        throw new Error('Invalid analysis response received.');
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.data?.requireLogin) {
        setErrorMessage(err.response?.data?.error || '🔒 Limit reached! Please Log In or Create an Account to continue using DocsAI Agreement Tool.');
        if (onOpenAuth) onOpenAuth('login');
      } else {
        setErrorMessage(err.response?.data?.error || err.message || 'Agreement analysis request failed. Please check network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    
    let report = `# LEGAL AGREEMENT AUDIT REPORT (${result.usedModel?.name || activeModelObj.name})\n\n`;
    report += `## Executive Summary\n${result.executiveSummary || ''}\n\n`;
    report += `## Risk Score: ${result.overallRiskScore?.score || 'N/A'}/100 (${result.overallRiskScore?.rating || 'Parsed'})\n${result.overallRiskScore?.summary || ''}\n\n`;
    
    if (result.highRiskClauses?.length) {
      report += `## High Risk Clauses\n` + result.highRiskClauses.map(c => `- **${c.clauseName}**: ${c.impact || ''}\n  *Snippet*: ${c.extractedSnippet}\n  *Rec*: ${c.recommendation}`).join('\n') + '\n\n';
    }
    if (result.mediumRiskClauses?.length) {
      report += `## Medium Risk Clauses\n` + result.mediumRiskClauses.map(c => `- **${c.clauseName}**: ${c.impact || ''}\n  *Rec*: ${c.recommendation}`).join('\n') + '\n\n';
    }
    if (result.importantDates?.length) {
      report += `## Important Dates\n` + result.importantDates.map(d => `- **${d.date}** (${d.event}): ${d.significance}`).join('\n') + '\n\n';
    }
    if (result.partiesInvolved?.length) {
      report += `## Parties Involved\n` + result.partiesInvolved.map(p => `- **${p.name}** (${p.role}): ${p.obligations}`).join('\n') + '\n\n';
    }
    if (result.financialObligations?.length) {
      report += `## Financial Obligations\n` + result.financialObligations.map(f => `- **${f.item}** (${f.amount}): ${f.details}`).join('\n') + '\n\n';
    }
    if (result.missingClauses?.length) {
      report += `## Missing Clauses\n` + result.missingClauses.map(m => `- **${m.clauseName}**: ${m.recommendation}`).join('\n') + '\n\n';
    }

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const riskRating = result?.overallRiskScore?.rating || (result?.riskSummary?.highRiskCount > 0 ? 'High Risk' : result?.riskSummary?.mediumRiskCount > 0 ? 'Moderate Risk' : 'Low Risk');
  const riskClass = riskRating.includes('High') ? 'risk-high' : riskRating.includes('Mod') ? 'risk-medium' : 'risk-low';

  return (
    <div className="main-card">
      {/* Header */}
      <div className="card-header-bar">
        <div className="card-title">
          <Scale size={22} style={{ color: 'var(--primary-teal)' }} />
          <span>Agreement & Legal Contract Summarizer</span>
        </div>
      </div>

      {/* AI Model Selector */}
      <AiModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />

      {/* Error Message Banner */}
      {errorMessage && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#991b1b', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div style={{ flexGrow: 1 }}>{errorMessage}</div>
        </div>
      )}

      {/* Responsive Upload Section */}
      <div className="input-group">
        <div className="upload-header-row">
          <label className="upload-header-title">
            Agreement / Legal Contract Document:
          </label>
          <div className="upload-actions-container">
            {fileName && (
              <span className="filename-badge">
                ✓ {fileName}
              </span>
            )}
            <label className="btn-upload-file">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Contract (PDF / DOCX / TXT)'}
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                accept=".pdf,.txt,.docx,.doc"
                hidden
              />
            </label>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        {!docText && (
          <div
            className={`upload-dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={32} style={{ color: 'var(--primary-teal)', opacity: 0.8 }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>
              Drag & drop your contract file here, or click upload button
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Supports PDF, Word (.docx), and plain text documents (Max 15MB)
            </div>
          </div>
        )}

        {/* Text Area Input */}
        <div className="custom-textarea-container" style={{ marginTop: '10px' }}>
          <textarea
            className="custom-textarea"
            placeholder="Paste contract, lease, sale deed, NDA, or service agreement text here or upload a document..."
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            style={{ minHeight: '180px' }}
          />
          <div className="textarea-footer">
            <div className="char-counter">
              Characters: <span className="highlight">{docText.length}</span>
            </div>
            {docText && (
              <button
                onClick={() => { setDocText(''); setFileName(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}
              >
                Clear Text
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button
          className="btn-primary-action"
          onClick={handleCheckAgreement}
          disabled={loading || (!docText.trim() && !fileName)}
          style={{
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: 800,
            borderRadius: '12px',
            minHeight: '48px'
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="spin-icon" />
              <span>Analyzing Legal Agreement...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Analyze Contract ({activeModelObj.name})</span>
            </>
          )}
        </button>
      </div>

      {/* Skeleton Loading State */}
      {loading && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="skeleton-box" style={{ height: '70px', width: '100%' }} />
          <div className="skeleton-box" style={{ height: '120px', width: '100%' }} />
          <div className="skeleton-box" style={{ height: '200px', width: '100%' }} />
        </div>
      )}

      {/* Non-Contract Document Warning Banner */}
      {result && result.isLegalContract === false && (
        <div style={{ marginTop: '24px', padding: '24px', borderRadius: '14px', border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <AlertTriangle size={28} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#b45309', margin: '0 0 6px 0' }}>
                Non-Contract Document Warning
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                {result.warning || 'The uploaded document does not appear to be a legal contract, agreement, NDA, or terms of service.'}
              </p>
              <div style={{ fontSize: '13px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-muted)' }}>
                <strong>Expected Documents for Agreement Tool:</strong> Property Sale Deed, Builder Agreement, Lease/Rent Contract, Non-Disclosure Agreement (NDA), Employment Contract, Vendor Terms of Service, or Commercial License.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results View (Only for Valid Legal Contracts) */}
      {result && result.isLegalContract !== false && !loading && (
        <div className="results-card" style={{ marginTop: '24px', borderRadius: '14px', padding: '20px', border: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
          {/* Header & Risk Score Gauge */}
          <div className="risk-gauge-container">
            <div className={`risk-score-circle ${riskClass}`}>
              {result.overallRiskScore?.score || (riskRating.includes('High') ? '75' : riskRating.includes('Mod') ? '45' : '15')}
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>{riskRating}</span>
                <span className="badge-tag" style={{ background: result.usedModel?.bg || '#e0f2fe', color: result.usedModel?.color || '#0284c7', fontSize: '11.5px' }}>
                  <Cpu size={12} /> {result.provider || result.usedModel?.name || activeModelObj.name}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {result.overallRiskScore?.summary || `Found ${result.highRiskClauses?.length || result.riskSummary?.highRiskCount || 0} High Risk, ${result.mediumRiskClauses?.length || result.riskSummary?.mediumRiskCount || 0} Medium Risk, and ${result.lowRiskClauses?.length || result.riskSummary?.lowRiskCount || 0} Low Risk clauses.`}
              </div>
            </div>

            <button
              onClick={handleCopyReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--card-bg)',
                color: 'var(--text-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: '40px'
              }}
            >
              {copied ? <Check size={16} color="#10b981" /> : <FileText size={16} />}
              <span>{copied ? 'Copied Report!' : 'Copy Full Audit'}</span>
            </button>
          </div>

          {/* Navigation Tabs for Analysis View */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '8px', marginTop: '20px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'summary', label: 'Executive Summary', icon: FileCheck },
              { id: 'clauses', label: `Clauses Audit (${(result.highRiskClauses?.length || 0) + (result.mediumRiskClauses?.length || 0) + (result.lowRiskClauses?.length || 0) || result.detectedClauses?.length || 0})`, icon: ShieldAlert },
              { id: 'timeline', label: `Dates & Parties`, icon: Calendar },
              { id: 'financials', label: `Financials`, icon: DollarSign },
              { id: 'recommendations', label: `Recommendations`, icon: Lightbulb }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--primary-teal)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-dark)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComp size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div style={{ background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.15)', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary-teal)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} /> Executive Document Overview
              </h4>
              <div style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-dark)' }}>
                <MarkdownRenderer content={result.executiveSummary || 'No summary available.'} />
              </div>
            </div>
          )}

          {/* TAB 2: CLAUSES RISK AUDIT */}
          {activeTab === 'clauses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* High Risk */}
              {(result.highRiskClauses || []).length > 0 && (
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#dc2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={18} /> High Risk Clauses ({result.highRiskClauses.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.highRiskClauses.map((c, idx) => (
                      <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid #fca5a5', borderLeft: '4px solid #ef4444', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#991b1b', marginBottom: '4px' }}>{c.clauseName}</div>
                        <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '6px' }}>{c.extractedSnippet}</div>
                        {c.impact && <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: '4px' }}><strong>Impact:</strong> {c.impact}</div>}
                        {c.recommendation && <div style={{ fontSize: '13px', color: '#15803d' }}><strong>Recommendation:</strong> {c.recommendation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Risk */}
              {(result.mediumRiskClauses || []).length > 0 && (
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#d97706', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={18} /> Medium Risk Clauses ({result.mediumRiskClauses.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.mediumRiskClauses.map((c, idx) => (
                      <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#92400e', marginBottom: '4px' }}>{c.clauseName}</div>
                        <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '6px' }}>{c.extractedSnippet}</div>
                        {c.impact && <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: '4px' }}><strong>Impact:</strong> {c.impact}</div>}
                        {c.recommendation && <div style={{ fontSize: '13px', color: '#15803d' }}><strong>Recommendation:</strong> {c.recommendation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Risk / Standard */}
              {(result.lowRiskClauses || result.detectedClauses || []).length > 0 && (
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#166534', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={18} /> Standard & Low Risk Provisions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(result.lowRiskClauses || result.detectedClauses || []).map((c, idx) => (
                      <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderLeft: '4px solid #10b981', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark)' }}>{c.clauseName || c.name}</div>
                        <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '4px' }}>{c.extractedSnippet}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATES & PARTIES */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Parties */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={18} color="var(--primary-teal)" /> Contracting Parties
                </h4>
                <div className="legal-grid-2col">
                  {(result.partiesInvolved || []).map((p, idx) => (
                    <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary-teal)' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Role: {p.role}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{p.obligations}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={18} color="var(--primary-teal)" /> Important Dates & Deadlines
                </h4>
                <div className="legal-grid-2col">
                  {(result.importantDates || []).map((d, idx) => (
                    <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#7c3aed' }}>{d.date}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', margin: '4px 0' }}>{d.event}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{d.significance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL OBLIGATIONS */}
          {activeTab === 'financials' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={18} color="#10b981" /> Financial Terms & Consideration
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(result.financialObligations || []).map((f, idx) => (
                  <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)' }}>{f.item}</span>
                      <span className="badge-tag" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '13px' }}>
                        {f.amount}
                      </span>
                    </div>
                    {f.dueDate && <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}><strong>Schedule / Due:</strong> {f.dueDate}</div>}
                    {f.details && <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginTop: '4px' }}>{f.details}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDATIONS & MISSING CLAUSES */}
          {activeTab === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Missing Clauses */}
              {(result.missingClauses || []).length > 0 && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#b91c1c', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={18} /> Missing Essential Clauses ({result.missingClauses.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.missingClauses.map((m, idx) => (
                      <div key={idx} style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#9f1239' }}>{m.clauseName}</div>
                        <div style={{ fontSize: '13px', color: '#4c0519', marginTop: '4px' }}>{m.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={18} color="#f59e0b" /> Legal Recommendations to Strengthen Contract
                </h4>
                <div className="legal-grid-2col">
                  {(result.legalRecommendations || result.improvementSuggestions || []).map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                        #{idx + 1} {item.title}
                      </div>
                      <div style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

