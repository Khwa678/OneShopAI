import React from 'react';
import { ArrowLeft, Settings, Flame, ShieldCheck, Zap } from 'lucide-react';

export default function AboutSection({ onSelectTool }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#ffffff',
      overflow: 'hidden',
      paddingBottom: '60px',
      boxSizing: 'border-box'
    }}>

      {/* Main Content Area - 2 Columns Layout Spreading Across Page matching Screenshot 3 */}
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '28px',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Left Column: Team Collaboration Image matching Screenshot 3 */}
        <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 15px 35px -10px rgba(0,0,0,0.15)',
            border: '1px solid #e2e8f0',
            background: '#f1f5f9',
            maxHeight: '400px',
            width: '100%'
          }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Team Collaborating"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.style.padding = '60px 16px';
                e.target.parentNode.style.textAlign = 'center';
                e.target.parentNode.innerHTML = `<div style="font-size: 44px; margin-bottom: 12px;">👥</div><div style="font-size: 18px; font-weight: 700; color: #0f172a;">DocsAI Team</div><div style="font-size: 13px; color: #64748b; margin-top: 6px;">Collaborating on document intelligence</div>`;
              }}
            />
          </div>
        </div>

        {/* Right Column: Copy & Feature Grid matching Screenshot 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 14px',
              letterSpacing: '-0.5px',
              wordBreak: 'break-word'
            }}>
              Who Are We?
            </h1>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#475569',
              margin: '0 0 16px',
              fontWeight: 500
            }}>
              We help people to build incredible brands and superior products. Our perspective is to furnish outstanding captivating services.
            </p>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#64748b',
              margin: 0
            }}>
              DocsAI is an AI-powered document intelligence platform designed to revolutionize digital file management. Whether you need fast document summarization, OCR extraction, resume ATS scoring, contract comparison, or humanized rewriting, our suite of tools delivers speed, accuracy, and peace of mind.
            </p>
          </div>

          {/* 2-Column Features Grid matching Screenshot 3 bottom elements */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginTop: '16px',
            paddingTop: '28px',
            borderTop: '1px solid #f1f5f9'
          }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} color="#0284c7" />
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Versatile Brand</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                We are crafting a digital method that subsists life across all mediums.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={22} color="#0284c7" />
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Digital Agency</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                We believe in innovation by integrating primary with elaborate ideas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
