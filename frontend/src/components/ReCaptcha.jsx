import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';

/**
 * Enhanced Production-Ready Google reCAPTCHA v2 Component with Interactive Fallback
 */
const ReCaptcha = forwardRef(({ onVerify, onExpire, theme = 'light' }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Fallback interactive Math CAPTCHA state
  const [mathProblem, setMathProblem] = useState({ num1: 3, num2: 4, answer: 7 });
  const [userMathInput, setUserMathInput] = useState('');
  const [mathVerified, setMathVerified] = useState(false);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setMathProblem({ num1, num2, answer: num1 + num2 });
    setUserMathInput('');
    setMathVerified(false);
  };

  const resetCaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (e) {}
    }
    generateMathProblem();
    if (onExpire) onExpire();
  };

  useImperativeHandle(ref, () => ({
    reset: resetCaptcha
  }));

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!containerRef.current || widgetIdRef.current !== null) return;
      try {
        if (window.grecaptcha && window.grecaptcha.render) {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme,
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
            },
            'error-callback': () => {
              if (isMounted) setLoadError(true);
            }
          });
          if (isMounted) setLoaded(true);
        }
      } catch (e) {
        console.warn('reCAPTCHA render notice:', e.message);
        if (isMounted) setLoadError(true);
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
    } else {
      window.onGrecaptchaLoad = () => {
        if (isMounted) renderWidget();
      };

      const existingScript = document.getElementById('google-recaptcha-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-recaptcha-script';
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onGrecaptchaLoad&render=explicit';
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          if (isMounted) setLoadError(true);
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.render) {
            clearInterval(interval);
            if (isMounted) renderWidget();
          }
        }, 200);
        setTimeout(() => {
          clearInterval(interval);
          if (isMounted && (!window.grecaptcha || !window.grecaptcha.render)) {
            setLoadError(true);
          }
        }, 4000);
      }
    }

    generateMathProblem();

    return () => {
      isMounted = false;
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {}
      }
    };
  }, [siteKey, theme]);

  const handleMathVerify = () => {
    if (parseInt(userMathInput, 10) === mathProblem.answer) {
      setMathVerified(true);
      const fallbackToken = `fallback_captcha_${Date.now()}_${mathProblem.answer}`;
      if (onVerify) onVerify(fallbackToken);
    } else {
      alert('Incorrect answer. Please try again!');
      generateMathProblem();
    }
  };

  const retryLoad = () => {
    setLoadError(false);
    widgetIdRef.current = null;
    const existing = document.getElementById('google-recaptcha-script');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'google-recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onGrecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError(true);
    };
    document.head.appendChild(script);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0', width: '100%' }}>
      {/* Container for Google reCAPTCHA */}
      <div 
        ref={containerRef} 
        id="recaptcha-widget-container" 
        style={{ minHeight: loadError ? '0px' : '78px', display: loadError ? 'none' : 'block' }} 
      />

      {/* Fallback Interactive CAPTCHA if reCAPTCHA script fails or is blocked */}
      {loadError && (
        <div style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#4f46e5" />
              <span>Security Check (Verification)</span>
            </div>
            <button 
              type="button" 
              onClick={retryLoad} 
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <RefreshCw size={12} /> Reload Google reCAPTCHA
            </button>
          </div>

          {!mathVerified ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Solve: {mathProblem.num1} + {mathProblem.num2} = ?
              </span>
              <input
                type="number"
                value={userMathInput}
                onChange={(e) => setUserMathInput(e.target.value)}
                placeholder="?"
                style={{
                  width: '60px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              />
              <button
                type="button"
                onClick={handleMathVerify}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Verify
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>
              <CheckCircle size={16} />
              <span>Verification Completed Successfully!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ReCaptcha;
