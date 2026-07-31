import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, X, AlertTriangle, Lock, Cpu } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAccept, onDecline }) {
  const [agreedCheck, setAgreedCheck] = useState(true);
  const [showDeclineNotice, setShowDeclineNotice] = useState(false);

  if (!isOpen) return null;

  const handleAcceptClick = () => {
    localStorage.setItem('docs_playground_terms_accepted', 'true');
    if (onAccept) onAccept();
    if (onClose) onClose();
  };

  const handleDeclineClick = () => {
    setShowDeclineNotice(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card-bg, #ffffff)',
        color: 'var(--text-dark, #0f172a)',
        width: '100%',
        maxWidth: '560px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color, #e2e8f0)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Terms & Conditions / Privacy Policy
              </h3>
              <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                Docs Playground Multi-LLM AI Platform
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {showDeclineNotice ? (
            <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <AlertTriangle size={32} color="#d48806" style={{ margin: '0 auto 8px' }} />
              <h4 style={{ margin: '0 0 8px', color: '#873800', fontSize: '16px', fontWeight: 800 }}>
                Terms Acceptance Required
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#595959', lineHeight: '1.5' }}>
                To process document text using ChatGPT, Claude, Gemini, DeepSeek, and Meta Llama models, you must accept our Privacy & Terms agreement.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDeclineNotice(false)}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Review & Agree Terms
                </button>
                {onDecline && (
                  <button
                    onClick={() => { setShowDeclineNotice(false); onDecline(); if (onClose) onClose(); }}
                    style={{
                      background: '#f5f5f5',
                      color: '#595959',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d9d9d9',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px', color: 'var(--text-dark, #334155)' }}>
                Welcome to <strong>Docs Playground</strong>. Before using our AI document processing tools, please review and accept our Terms of Service and Privacy Policy:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', background: 'var(--textarea-bg, #f8fafc)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <Lock size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark, #0f172a)' }}>
                      1. Document Security & Privacy
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', marginTop: '2px' }}>
                      All uploaded resumes, agreements, images, and text documents are encrypted in transit and temporary memory. We never sell or share user data.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', background: 'var(--textarea-bg, #f8fafc)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <Cpu size={20} color="#4f46e5" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark, #0f172a)' }}>
                      2. Multi-LLM Processing Engine
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', marginTop: '2px' }}>
                      Tool outputs are generated using ChatGPT (GPT-4o), Claude 3.5 Sonnet, Google Gemini 2.0, DeepSeek R1, or Meta Llama 3.3 as selected by the user.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', background: 'var(--textarea-bg, #f8fafc)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <FileText size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark, #0f172a)' }}>
                      3. Responsible AI Assistance Disclaimer
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', marginTop: '2px' }}>
                      ATS scoring, agreement clause detection, OCR extractions, and summaries provide automated guidance and should be verified for official legal/academic use.
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#065f46'
              }}>
                <input
                  type="checkbox"
                  checked={agreedCheck}
                  onChange={(e) => setAgreedCheck(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                />
                <span>I have read, understood, and agree to the Terms of Service & Privacy Policy</span>
              </label>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!showDeclineNotice && (
          <div style={{
            padding: '16px 24px',
            background: 'var(--textarea-bg, #f8fafc)',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={handleDeclineClick}
              style={{
                background: 'transparent',
                color: 'var(--text-muted, #64748b)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Decline
            </button>

            <button
              type="button"
              onClick={handleAcceptClick}
              disabled={!agreedCheck}
              style={{
                background: agreedCheck ? '#10b981' : '#cbd5e1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: agreedCheck ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: agreedCheck ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <CheckCircle size={16} />
              <span>I Agree & Accept Terms</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
