import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

export default function AdSlot({ type = 'sidebar', label = 'Advertisement' }) {
  if (type === 'sidebar') {
    return (
      <div 
        className="ad-sidebar-slot"
        style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '380px',
          textAlign: 'center',
          position: 'sticky',
          top: '80px',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Megaphone size={14} color="#6366f1" />
          <span>{label}</span>
        </div>

        <div style={{ background: 'var(--light-bg, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '12px', padding: '24px 16px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            AD
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark, #0f172a)' }}>
            Sponsored Banner Slot
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', lineHeight: '1.4' }}>
            Reserved area for Google AdSense or Custom Partner Ads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px 20px', margin: '20px 0', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
      📢 <strong>{label}:</strong> Reserved for AdSense Horizontal Banner
    </div>
  );
}
