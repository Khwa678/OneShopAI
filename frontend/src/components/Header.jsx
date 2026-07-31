import React, { useState } from 'react';
import { LogOut, FileText, Eye, Target, Scale, ShieldAlert, ShieldCheck, Mail, Info, UserCheck, ChevronDown, Globe, Palette } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Header({ user, onOpenAuth, onLogout, selectedLang = 'en', setSelectedLang, onSelectTool, onOpenPricing, currentTheme = 'light', onSelectTheme, onOpenTerms, onOpenContact, onOpenAbout }) {
  const [productsOpen, setProductsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const t = translations[selectedLang] || translations.en;

  const themes = [
    { id: 'light', name: 'Light Studio', icon: '☀️', color: '#4f46e5' },
    { id: 'midnight', name: 'Midnight Dark', icon: '🌙', color: '#6366f1' },
    { id: 'emerald', name: 'Nature Oasis', icon: '🌿', color: '#10b981' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '🔮', color: '#06b6d4' },
    { id: 'sunset', name: 'Sunset Amber', icon: '🌅', color: '#f59e0b' },
    { id: 'ocean', name: 'Ocean Deep', icon: '🌊', color: '#0ea5e9' },
    { id: 'royal', name: 'Royal Violet', icon: '💜', color: '#a855f7' },
    { id: 'coffee', name: 'Coffee Roast', icon: '☕', color: '#d97706' }
  ];

  const activeThemeObj = themes.find(th => th.id === currentTheme) || themes[0];

  const toolsList = [
    { id: 'summarizer', name: t.summarizer, icon: FileText, desc: t.summarizerTitle },
    { id: 'ocr', name: t.ocr, icon: Eye, desc: t.ocrTitle },
    { id: 'ats', name: t.ats, icon: Target, desc: t.atsTitle },
    { id: 'agreement', name: t.agreement, icon: Scale, desc: t.agreementTitle },
    { id: 'humanizer', name: t.humanizer, icon: UserCheck, desc: t.humanizerTitle }
  ];

  const languages = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'hi', flag: '🇮🇳', label: 'हिंदी' }
  ];

  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];
  const isDark = currentTheme !== 'light';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="brand-logo" 
          onClick={(e) => { e.preventDefault(); if (onSelectTool) onSelectTool('summarizer'); }}
        >
          <div className="brand-icon">P</div>
          <span>Docs Playground</span>
        </a>

        {/* Navigation Items */}
        <ul className="nav-links">
          <li 
            className="nav-link" 
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={() => setProductsOpen(!productsOpen)}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            {t.products} <ChevronDown size={14} />
            
            {productsOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: isDark ? '#111827' : 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                border: isDark ? '1px solid #1f2937' : '1px solid #e2e8f0',
                padding: '8px',
                minWidth: '260px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {toolsList.map(tl => {
                  const Icon = tl.icon;
                  return (
                    <div
                      key={tl.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectTool) onSelectTool(tl.id);
                        setProductsOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      className="dropdown-item-hover"
                    >
                      <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '6px', color: '#4f46e5' }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>{tl.name}</div>
                        <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>{tl.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
          <li className="nav-link">
            <button 
              onClick={() => onSelectTool && onSelectTool('blogs')} 
              style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              {t.blogs}
            </button>
          </li>
          <li className="nav-link">
            <button 
              onClick={() => { if (onOpenAbout) onOpenAbout(); else if (onSelectTool) onSelectTool('about'); }} 
              style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Info size={15} color="#0284c7" /> About Us
            </button>
          </li>
          <li className="nav-link">
            <button 
              onClick={() => { if (onOpenContact) onOpenContact(); else if (onSelectTool) onSelectTool('contact'); }} 
              style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Mail size={15} color="#4f46e5" /> Contact Us
            </button>
          </li>
        </ul>

        {/* User Auth & Theme Actions */}
        <div className="nav-actions">
          {/* Multi-Theme Selector Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setThemeOpen(!themeOpen)}
              title="Choose Theme"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                background: currentTheme === 'light' ? '#ffffff' : '#1f2937',
                color: activeThemeObj.color,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              <Palette size={15} />
              <span>{activeThemeObj.icon} {activeThemeObj.name}</span>
              <ChevronDown size={13} />
            </button>

            {themeOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: currentTheme === 'light' ? '#ffffff' : '#111827',
                borderRadius: '12px',
                border: currentTheme === 'light' ? '1px solid #e2e8f0' : '1px solid #1f2937',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
                padding: '6px',
                minWidth: '170px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {themes.map(th => {
                  const isCurrent = currentTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => { if (onSelectTheme) onSelectTheme(th.id); setThemeOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: isCurrent ? 800 : 500,
                        color: isDark ? '#f8fafc' : '#0f172a',
                        background: isCurrent ? (isDark ? '#3730a3' : '#e0e7ff') : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      className="dropdown-item-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px' }}>{th.icon}</span>
                        <span style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{th.name}</span>
                      </div>
                      {isCurrent && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: th.color }}></span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Language Selector Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13.5px',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#334155',
                background: isDark ? '#1f2937' : '#ffffff',
                border: isDark ? '1px solid #374151' : '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Globe size={15} color="#4f46e5" />
              <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
              <ChevronDown size={13} color={isDark ? '#cbd5e1' : '#64748b'} />
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: isDark ? '#111827' : '#ffffff',
                borderRadius: '12px',
                border: isDark ? '1px solid #1f2937' : '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                padding: '6px',
                minWidth: '140px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {languages.map(l => {
                  const isSelectedLang = selectedLang === l.code;
                  return (
                    <div
                      key={l.code}
                      onClick={() => { setSelectedLang && setSelectedLang(l.code); setLangOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: isSelectedLang ? 800 : 500,
                        color: isDark ? '#ffffff' : '#0f172a',
                        background: isSelectedLang ? (isDark ? '#3730a3' : '#e0e7ff') : 'transparent',
                        cursor: 'pointer'
                      }}
                      className="dropdown-item-hover"
                    >
                      <span style={{ fontSize: '15px' }}>{l.flag}</span>
                      <span>{l.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="user-badge" style={{ background: isDark ? '#1f2937' : '#f1f5f9', border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="user-avatar" style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, fontSize: '14px' }}>{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="btn-auth-link"
                title={t.logout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                <LogOut size={16} /> {t.logout}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                className="btn-auth-link" 
                onClick={() => onOpenAuth('login')} 
                style={{ background: isDark ? '#1f2937' : '#ffffff', border: isDark ? '1px solid #374151' : '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, color: isDark ? '#ffffff' : '#1e293b', cursor: 'pointer', fontSize: '14px' }}
              >
                {t.login}
              </button>
              <button 
                className="btn-get-started" 
                onClick={() => onOpenAuth('register')} 
                style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



