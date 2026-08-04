import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import PricingModal from './components/PricingModal';
import TermsModal from './components/TermsModal';
import ContactModal from './components/ContactModal';
import TermsSection from './components/TermsSection';
import PrivacySection from './components/PrivacySection';
import ContactSection from './components/ContactSection';
import AboutSection from './components/AboutSection';
import SummarizerTool from './components/Tools/SummarizerTool';
import OcrTool from './components/Tools/OcrTool';
import AtsTool from './components/Tools/AtsTool';
import AgreementTool from './components/Tools/AgreementTool';
import HumanizerTool from './components/Tools/HumanizerTool';
import BlogSection from './components/BlogSection';
import TrustedToolsSection from './components/TrustedToolsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import { getCurrentUser, logoutUser, loginWithGoogle } from './services/api';
import { translations } from './utils/translations';

import { FileText, Eye, Target, Scale, UserCheck, BookOpen, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState('summarizer');
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [termsToast, setTermsToast] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('docs_playground_theme');
    return saved || 'emerald';
  });

  const t = translations[selectedLang] || translations.en;

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('docs_playground_theme', theme);
  }, [theme]);

  // Handle same-tab navigation & browser history state (popstate)
  const handleNavigatePage = (pageName) => {
    setActiveTool(pageName);
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageName);
    window.history.pushState({ page: pageName }, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check authentication status on load via HttpOnly cookie (M3 Fix)
  useEffect(() => {
    const savedUser = localStorage.getItem('docs_playground_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // Query server session using HttpOnly cookie
    getCurrentUser()
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('docs_playground_user', JSON.stringify(res.data.user));
        }
      })
      .catch((err) => {
        // Only invalidate local session if server explicitly returned 401 Unauthorized
        if (err.response && err.response.status === 401) {
          setUser(null);
          localStorage.removeItem('docs_playground_user');
        }
      });

    const checkUrlPage = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const tokenParam = params.get('token');

      if (tokenParam || pageParam === 'reset-password') {
        if (tokenParam) setResetToken(tokenParam);
        setResetPasswordModalOpen(true);
      }

      if (pageParam && ['terms', 'privacy', 'contact', 'about', 'blogs', 'summarizer', 'ocr', 'ats', 'agreement', 'humanizer'].includes(pageParam)) {
        setActiveTool(pageParam);
      }
    };

    checkUrlPage();

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') || 'summarizer';
      setActiveTool(pageParam);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout notice:', e.message);
    }
    localStorage.removeItem('docs_playground_user');
    localStorage.removeItem('docs_playground_token');
    setUser(null);
  };

  const handleAcceptTerms = () => {
    setTermsToast(true);
    setTimeout(() => setTermsToast(false), 3000);
  };

  const isStandalonePage = ['terms', 'privacy', 'contact', 'about', 'blogs'].includes(activeTool);

  return (
    <div className="app-container">
      {/* Toast Notification when Terms Accepted */}
      {termsToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 700,
          zIndex: 10000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle size={18} />
          <span>Terms & Privacy Policy Accepted!</span>
        </div>
      )}

      {/* Top Navbar */}
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        onSelectTool={(toolId) => handleNavigatePage(toolId)}
        onOpenPricing={() => setPricingModalOpen(true)}
        currentTheme={theme}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
        onOpenTerms={() => handleNavigatePage('terms')}
        onOpenPrivacy={() => handleNavigatePage('privacy')}
        onOpenContact={() => handleNavigatePage('contact')}
        onOpenAbout={() => handleNavigatePage('about')}
      />

      {/* Main Content Area */}
      <main className="main-content" style={{ maxWidth: isStandalonePage ? '100%' : '1140px', margin: isStandalonePage ? '0' : '0 auto', width: '100%', padding: isStandalonePage ? '0' : '24px 16px' }}>
        
        {/* Horizontal Clean Tool Selector Tabs (Hidden on standalone pages like Contact/About/Terms/Privacy) */}
        {!isStandalonePage && (
          <div
            className="horizontal-tool-tabs"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              padding: '6px 12px',
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {[
              { id: 'summarizer', label: t.summarizer, icon: FileText },
              { id: 'ocr', label: t.ocr, icon: Eye },
              { id: 'ats', label: t.ats, icon: Target },
              { id: 'agreement', label: t.agreement, icon: Scale },
              { id: 'humanizer', label: t.humanizer, icon: UserCheck },
            ].map(tool => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleNavigatePage(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? '#4f46e5' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-dark, #475569)',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Single Main Tool / Page Canvas */}
        <div className="main-tool-canvas" style={{ width: '100%' }}>
          {activeTool === 'summarizer' && <SummarizerTool lang={selectedLang} user={user} onOpenAuth={handleOpenAuth} />}
          {activeTool === 'ocr' && <OcrTool lang={selectedLang} user={user} onOpenAuth={handleOpenAuth} />}
          {activeTool === 'ats' && <AtsTool lang={selectedLang} user={user} onOpenAuth={handleOpenAuth} />}
          {activeTool === 'agreement' && <AgreementTool lang={selectedLang} user={user} onOpenAuth={handleOpenAuth} />}
          {activeTool === 'humanizer' && <HumanizerTool lang={selectedLang} user={user} onOpenAuth={handleOpenAuth} />}
          {activeTool === 'blogs' && <BlogSection lang={selectedLang} onSelectTool={(toolId) => handleNavigatePage(toolId)} />}
          {activeTool === 'terms' && <TermsSection onSelectTool={(toolId) => handleNavigatePage(toolId)} />}
          {activeTool === 'privacy' && <PrivacySection onSelectTool={(toolId) => handleNavigatePage(toolId)} />}
          {activeTool === 'contact' && <ContactSection onSelectTool={(toolId) => handleNavigatePage(toolId)} />}
          {activeTool === 'about' && <AboutSection onSelectTool={(toolId) => handleNavigatePage(toolId)} />}
        </div>

        {/* Home Marketing Sections (Only rendered on home tool views, hidden on standalone legal/contact/about pages) */}
        {!isStandalonePage && (
          <>
            <TrustedToolsSection lang={selectedLang} onSelectTool={(toolId) => handleNavigatePage(toolId)} />
            <WhyChooseUsSection lang={selectedLang} />
            <FaqSection lang={selectedLang} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        lang={selectedLang}
        onSelectTool={(toolId) => handleNavigatePage(toolId)}
        onOpenTerms={() => handleNavigatePage('terms')}
        onOpenPrivacy={() => handleNavigatePage('privacy')}
        onOpenContact={() => handleNavigatePage('contact')}
        onOpenAbout={() => handleNavigatePage('about')}
      />

      {/* Auth Dialog Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(userData) => setUser(userData)}
      />

      {/* Gmail Email Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordModalOpen}
        token={resetToken}
        onClose={() => setResetPasswordModalOpen(false)}
        onSuccessLogin={() => handleOpenAuth('login')}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
        onDecline={() => console.log('Terms declined')}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
