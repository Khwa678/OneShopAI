import React from 'react';
import { 
  FileText, LayoutGrid, Cpu, Download, Globe2, Layers 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Smart Document Summaries",
      desc: "Quickly get key takeaways from long documents, PDFs, and articles without reading hundreds of pages.",
      icon: FileText,
      color: '#4f46e5',
      bg: '#e0e7ff'
    },
    {
      title: "All-in-One Tools",
      desc: "Access text summarization, OCR extraction, ATS resume scoring, contract checks, and editing in one clean place.",
      icon: LayoutGrid,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      title: "Multi-Model Intelligence",
      desc: "Powered by top AI models including ChatGPT, Claude, Gemini, DeepSeek, and Meta Llama for fast, accurate results.",
      icon: Cpu,
      color: '#d97706',
      bg: '#fef3c7'
    },
    {
      title: "Easy Export & Sharing",
      desc: "Copy formatted outputs or download clean reports to share with your team or save for study reference.",
      icon: Download,
      color: '#16a34a',
      bg: '#dcfce7'
    },
    {
      title: "Multi-Language Support",
      desc: "Process scanned documents and text in over 50 languages with built-in optical character recognition.",
      icon: Globe2,
      color: '#7c3aed',
      bg: '#f3e8ff'
    },
    {
      title: "Fast File Uploads",
      desc: "Upload PDFs, scanned contracts, images, or text documents and process them quickly without delay.",
      icon: Layers,
      color: '#e11d48',
      bg: '#ffe4e6'
    }
  ];

  return (
    <section style={{ marginTop: '48px', marginBottom: '48px' }}>
      {/* Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 32px auto' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-dark, #0f172a)',
          margin: '0 0 6px 0'
        }}>
          Why People Use Docs Playground
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
          Simple, fast tools designed to help you handle documents and text in everyday work and study.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: feat.bg,
                color: feat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Icon size={18} />
              </div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-dark, #0f172a)',
                margin: '0 0 6px 0'
              }}>
                {feat.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted, #64748b)',
                lineHeight: '1.5',
                margin: 0
              }}>
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
