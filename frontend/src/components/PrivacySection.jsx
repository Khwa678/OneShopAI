import React from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacySection({ onSelectTool }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      padding: '32px 24px 60px',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Navigation */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={26} color="#ffffff" />
          <span style={{ fontSize: '18px', fontWeight: 800 }}>Docs Playground • Privacy Policy</span>
        </div>

        {onSelectTool && (
          <button
            onClick={() => onSelectTool('summarizer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
              padding: '10px 20px',
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

      {/* Mac-Style Window Container Spreading Across the Page */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxSizing: 'border-box'
      }} className="legal-window-container">
        {/* Mac OS Window Header Dots matching Screenshot 2 */}
        <div style={{
          background: '#f8fafc',
          padding: '14px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'hidden'
        }}>
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ff5f56', flexShrink: 0 }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#27c93f', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, marginLeft: '10px', wordBreak: 'break-all' }}>
            docsplayground.com / privacy-policy
          </span>
        </div>

        {/* Window Document Body */}
        <div style={{ padding: '32px 24px', color: '#1e293b', lineHeight: '1.7', boxSizing: 'border-box' }} className="legal-document-body">
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 20px',
            textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Privacy Policy
          </h1>

          <p style={{ fontSize: '14.5px', color: '#475569', marginBottom: '28px', lineHeight: '1.7' }}>
            We respect your privacy and are committed to protecting your personal information. This Privacy Policy Notice outlines how Docs Playground collects, uses, discloses, and safeguards your personal data when you visit or use our website and document intelligence tools.
          </p>

          {/* Section 1 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              INFORMATION WE COLLECT
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 10px' }}>
              When you use our website, we may collect personal identification information (such as your name and email address), technical information (IP address, browser type, device information), and usage telemetry.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              DOCUMENT CONFIDENTIALITY & ENCRYPTION
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              Documents uploaded to Docs Playground for processing (summarization, OCR, ATS evaluation, agreement matching) are transferred over encrypted HTTPS SSL protocols. Files are automatically purged from our servers after processing is completed. We never monetize, share, or sell your documents to third parties.
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              HOW WE USE YOUR INFORMATION
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              We use collected information strictly to provide document processing services, manage user accounts, respond to support inquiries, prevent fraudulent activity, and maintain system stability and performance.
            </p>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              COOKIES AND ANALYTICS
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              We use essential cookies to maintain user session state and theme preferences. You may choose to disable non-essential cookies via your browser settings at any time.
            </p>
          </div>

          {/* Footer inside Window */}
          <div style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#10b981" />
              <span>Strict Privacy Policy Protected</span>
            </div>
            {onSelectTool && (
              <button
                onClick={() => onSelectTool('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View Terms & Conditions →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
