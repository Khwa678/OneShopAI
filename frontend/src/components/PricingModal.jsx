import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, Shield, Star, ArrowRight } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, onOpenAuth }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly', 'annual'
  const [planType, setPlanType] = useState('personal'); // 'personal', 'business'

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      priceMonthly: 0,
      priceAnnual: 0,
      badge: 'Starter',
      popular: false,
      features: [
        '15,000 Characters per AI detection',
        'Standard document summarization',
        'Basic OCR text extraction',
        '1,250,000 Words allowance / month',
        'Community email support'
      ],
      notIncluded: ['Batch file upload for AI detection', 'PDF report export', 'Priority neural processing']
    },
    {
      id: 'pro',
      name: 'PRO',
      priceMonthly: 9.99,
      priceAnnual: 7.99,
      badge: 'Save 20%',
      popular: false,
      features: [
        '100,000 Characters per AI detection',
        '50 Batch files check for AI detection',
        'Generate PDF reports for AI detection',
        '4,500,000 Words allowance / month',
        'No ads experience'
      ],
      notIncluded: ['Plagiarism checker credits']
    },
    {
      id: 'plus',
      name: 'PLUS',
      priceMonthly: 19.99,
      priceAnnual: 14.99,
      badge: 'Most Popular 🔥',
      popular: true,
      features: [
        '100,000 Characters per AI detection',
        '60 Batch files check for AI detection',
        'Generate PDF reports & export certs',
        '35,000 Words in Plagiarism Checker / mo',
        '5,000,000 Words allowance / month',
        'Priority high-speed neural processing'
      ],
      notIncluded: []
    },
    {
      id: 'max',
      name: 'MAX',
      priceMonthly: 26.99,
      priceAnnual: 18.99,
      badge: 'Best Value',
      popular: false,
      features: [
        '150,000 Characters per AI detection',
        '75 Batch files check for AI detection',
        'Generate PDF reports for AI detection',
        '60,000 Words in Plagiarism Checker / mo',
        '7,500,000 Words allowance / month',
        'Dedicated API access & webhook support'
      ],
      notIncluded: []
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100, padding: '20px' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '1180px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '20px' }}
      >
        <button className="modal-close-btn" onClick={onClose} style={{ top: '20px', right: '20px' }}>
          <X size={22} />
        </button>

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            DocsAI Pricing & Plans
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
            Free, until you're ready. Unlock the power of AI with DocsAI to detect AI content, summarize contracts, analyze ATS resumes, and perfect your writing.
          </p>
        </div>

        {/* Plan Type Selector & Billing Cycle Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setPlanType('personal')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                background: planType === 'personal' ? '#095475' : 'transparent',
                color: planType === 'personal' ? 'white' : '#475569'
              }}
            >
              Personal Plans
            </button>
            <button
              onClick={() => setPlanType('business')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                background: planType === 'business' ? '#095475' : 'transparent',
                color: planType === 'business' ? 'white' : '#475569'
              }}
            >
              Business & EDU Plans
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: billingCycle === 'monthly' ? '#0f172a' : '#64748b' }}>Monthly</span>
            <div 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              style={{
                width: '52px',
                height: '28px',
                background: '#095475',
                borderRadius: '20px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: billingCycle === 'annual' ? 'flex-end' : 'flex-start',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: billingCycle === 'annual' ? '#0f172a' : '#64748b' }}>Annually</span>
            <span className="badge-tag" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
              30% off annually (110 days free) 🎉
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {plans.map((p) => {
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;
            return (
              <div 
                key={p.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: p.popular ? '2px solid #095475' : '1px solid #e2e8f0',
                  padding: '24px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: p.popular ? '0 10px 25px -5px rgba(9, 84, 117, 0.25)' : 'none',
                  transform: p.popular ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {p.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#095475',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    {p.badge}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{p.name}</h3>
                  {!p.popular && <span className="badge-tag" style={{ background: '#f1f5f9', color: '#475569' }}>{p.badge}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#095475' }}>${price}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>/{billingCycle === 'annual' ? 'month (billed yearly)' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && p.priceMonthly > 0 && (
                    <div style={{ fontSize: '12px', color: '#dc2626', textDecoration: 'line-through', marginTop: '2px' }}>
                      ${p.priceMonthly}/month
                    </div>
                  )}
                </div>

                <button
                  className={p.popular ? 'btn-primary-action' : 'btn-modal-submit'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    background: p.popular ? '#095475' : '#1e293b',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth('register');
                  }}
                >
                  {p.priceMonthly === 0 ? 'Get Started Free' : 'Upgrade to ' + p.name}
                </button>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, fontSize: '13px', color: '#334155' }}>
                  {p.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {p.notIncluded.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: 0.5 }}>
                      <X size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Table */}
        <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Compare DocsAI Features
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '10px', color: '#475569' }}>Feature / Capability</th>
                  <th style={{ padding: '10px', color: '#0f172a', fontWeight: 700 }}>FREE</th>
                  <th style={{ padding: '10px', color: '#0f172a', fontWeight: 700 }}>PRO</th>
                  <th style={{ padding: '10px', color: '#095475', fontWeight: 800 }}>PLUS</th>
                  <th style={{ padding: '10px', color: '#0f172a', fontWeight: 700 }}>MAX</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Max characters per AI check</td>
                  <td style={{ padding: '10px' }}>15,000</td>
                  <td style={{ padding: '10px' }}>100,000</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#095475' }}>100,000</td>
                  <td style={{ padding: '10px' }}>150,000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Batch file uploads</td>
                  <td style={{ padding: '10px' }}>1 File</td>
                  <td style={{ padding: '10px' }}>50 Files</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#095475' }}>60 Files</td>
                  <td style={{ padding: '10px' }}>75 Files</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>PDF export & Certificate</td>
                  <td style={{ padding: '10px' }}><X size={16} color="#dc2626" /></td>
                  <td style={{ padding: '10px' }}><Check size={16} color="#16a34a" /></td>
                  <td style={{ padding: '10px' }}><Check size={16} color="#16a34a" /></td>
                  <td style={{ padding: '10px' }}><Check size={16} color="#16a34a" /></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Words allowance / month</td>
                  <td style={{ padding: '10px' }}>1.25M</td>
                  <td style={{ padding: '10px' }}>4.5M</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#095475' }}>5.0M</td>
                  <td style={{ padding: '10px' }}>7.5M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
