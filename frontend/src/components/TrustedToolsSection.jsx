import React from 'react';
import { 
  FileText, Eye, Target, Scale, UserCheck, BookOpen, ArrowRight 
} from 'lucide-react';

export default function TrustedToolsSection({ onSelectTool }) {
  const tools = [
    { id: 'summarizer', name: 'AI Summarizer', icon: FileText, color: '#4f46e5', bg: '#e0e7ff' },
    { id: 'ocr', name: 'OCR Text Extractor', icon: Eye, color: '#0284c7', bg: '#e0f2fe' },
    { id: 'ats', name: 'ATS Resume Score', icon: Target, color: '#d97706', bg: '#fef3c7' },
    { id: 'agreement', name: 'Agreement Summarizer', icon: Scale, color: '#e11d48', bg: '#ffe4e6' },
    { id: 'humanizer', name: 'AI Humanizer', icon: UserCheck, color: '#16a34a', bg: '#dcfce7' },
    { id: 'blogs', name: 'Blogs & Guides', icon: BookOpen, color: '#7c3aed', bg: '#f3e8ff' }
  ];

  return (
    <section style={{ marginTop: '40px', marginBottom: '32px' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text-dark, #0f172a)',
        marginBottom: '20px'
      }}>
        Explore Document Tools
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '14px'
      }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool && onSelectTool(tool.id)}
              style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '10px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: tool.bg,
                  color: tool.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={17} />
                </div>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-dark, #0f172a)' }}>
                  {tool.name}
                </span>
              </div>
              <ArrowRight size={16} color="var(--text-muted, #94a3b8)" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
