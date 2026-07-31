import React from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function TermsSection({ onSelectTool }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
          <span style={{ fontSize: '18px', fontWeight: 800 }}>Docs Playground • Legal Terms</span>
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
            docsplayground.com / terms-and-conditions
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
            Terms and Conditions
          </h1>

          <p style={{ fontSize: '14.5px', color: '#475569', marginBottom: '28px', lineHeight: '1.7' }}>
            Welcome to our docsplayground.com, our online document platform! Docs Playground® and its associates provide their services to you subject to the following conditions. If you visit or shop within this website, you accept these conditions. Please read them carefully.
          </p>

          {/* Section 1 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              PRIVACY
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              Please review our Privacy Policy Notice, which also governs your visit to our website, to understand our privacy and data protection practices.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              ELECTRONIC COMMUNICATIONS
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              When you visit DOCSPLAYGROUND.COM or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              COPYRIGHT & TRADEMARKS
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Docs Playground or its content suppliers and protected by international copyright laws.
            </p>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              LICENSE AND SITE ACCESS
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              Docs Playground grants you a limited license to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it, except with express written consent of Docs Playground.
            </p>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              YOUR MEMBERSHIP ACCOUNT
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
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
              <span>Encrypted & Secured Legal Document</span>
            </div>
            {onSelectTool && (
              <button
                onClick={() => onSelectTool('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View Privacy Policy →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
