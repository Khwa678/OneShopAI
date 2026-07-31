import React from 'react';
import { Clock, Image, RefreshCw, CheckCircle2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { translations } from '../utils/translations';

export default function FeaturesGrid({ onSelectTool, lang }) {
  const t = translations[lang] || translations.en;

  const tools = [
    { id: 'summarizer', name: t.summarizer, icon: Clock, bg: '#f3e8ff', color: '#7e22ce' },
    { id: 'ocr', name: t.ocr, icon: Image, bg: '#e0f2fe', color: '#0369a1' },
    { id: 'ats', name: t.ats, icon: RefreshCw, bg: '#fef3c7', color: '#b45309' },
    { id: 'agreement', name: t.agreement, icon: ShieldCheck, bg: '#ffe4e6', color: '#be123c' },
    { id: 'detector', name: t.detector, icon: CheckCircle2, bg: '#e0e7ff', color: '#4338ca' },
    { id: 'humanizer', name: t.humanizer, icon: UserCheck, bg: '#dcfce7', color: '#15803d' }
  ];

  return (
    <section className="features-section">
      <h2 className="section-title-center">
        {t.trustedTools}
      </h2>

      <div className="tools-grid">
        {tools.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div 
              key={idx} 
              className="feature-box"
              onClick={() => onSelectTool(t.id)}
            >
              <div className="feature-info">
                <div className="feature-icon-circle" style={{ background: t.bg, color: t.color }}>
                  <Icon size={22} />
                </div>
                <span className="feature-name">{t.name}</span>
              </div>
              <ArrowRight size={18} style={{ color: '#94a3b8' }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
