import React from 'react';
import { Linkedin, Twitter, Facebook, Mail, ShieldCheck, Lock } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Footer({ onOpenPricing, onSelectTool, lang = 'en', onOpenTerms, onOpenPrivacy, onOpenContact, onOpenAbout }) {
  const t = translations[lang] || translations.en;

  const handleTermsClick = () => {
    if (onOpenTerms) onOpenTerms();
    else if (onSelectTool) onSelectTool('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrivacyClick = () => {
    if (onOpenPrivacy) onOpenPrivacy();
    else if (onSelectTool) onSelectTool('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    if (onOpenContact) onOpenContact();
    else if (onSelectTool) onSelectTool('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = () => {
    if (onOpenAbout) onOpenAbout();
    else if (onSelectTool) onSelectTool('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Column 1 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>
            <div className="brand-icon" style={{ width: '34px', height: '34px', borderRadius: '8px', fontSize: '16px' }}>P</div>
            <span className="footer-brand-title">Docs Playground</span>
          </div>
          <p className="footer-desc" style={{ fontSize: '13.5px', lineHeight: 1.6, maxWidth: '280px' }}>
            © 2026 Docs Playground<br/>
            {t.footerRights}
          </p>

          <div className="social-icons">
            <a href="#" className="social-icon-btn"><Linkedin size={16} /></a>
            <a href="#" className="social-icon-btn"><Twitter size={16} /></a>
            <a href="#" className="social-icon-btn"><Facebook size={16} /></a>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="footer-col-title">{t.footerNav}</h4>
          <ul className="footer-links">
            <li>
              <button 
                onClick={handleAboutClick} 
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => { if (onSelectTool) onSelectTool('blogs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                {t.blogs}
              </button>
            </li>
            <li>
              <button 
                onClick={handleTermsClick} 
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button 
                onClick={handlePrivacyClick} 
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={handleContactClick} 
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Contact Support
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="footer-col-title">{t.footerTools}</h4>
          <ul className="footer-links">
            <li><button onClick={() => { if (onSelectTool) onSelectTool('summarizer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>{t.summarizer}</button></li>
            <li><button onClick={() => { if (onSelectTool) onSelectTool('ocr'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>{t.ocr}</button></li>
            <li><button onClick={() => { if (onSelectTool) onSelectTool('ats'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>{t.ats}</button></li>
            <li><button onClick={() => { if (onSelectTool) onSelectTool('agreement'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>{t.agreement}</button></li>
            <li><button onClick={() => { if (onSelectTool) onSelectTool('humanizer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>{t.humanizer}</button></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="footer-col-title">{t.footerSupport}</h4>
          <p className="footer-desc" style={{ fontSize: '13.5px', marginBottom: '10px' }}>
            Reach out to our support team:
          </p>
          <button 
            onClick={handleContactClick} 
            className="footer-contact-link" 
            style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Mail size={16} /> support@docsplayground.ai
          </button>
          <p className="footer-desc" style={{ fontSize: '13px', marginTop: '12px', lineHeight: 1.5 }}>
            Fast Response • Document Intelligence Platform
          </p>
        </div>
      </div>



      <div className="footer-bottom">
        Docs Playground • Built for High-Performance Document Processing
      </div>
    </footer>
  );
}
