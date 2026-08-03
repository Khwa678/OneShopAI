import React, { useEffect, useRef, useState } from 'react';

/**
 * Production-Ready Real Google reCAPTCHA v2 Component
 */
export default function ReCaptcha({ onVerify, onExpire, theme = 'light' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Ldk3XItAAAAAKwwu2Efx4t2BIYSJR1V6Edv05O_';

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
              setLoadError(true);
            }
          });
          if (isMounted) setLoaded(true);
        }
      } catch (e) {
        console.warn('reCAPTCHA render notice:', e.message);
      }
    };

    // If script is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
    } else {
      // Define global onload callback if not present
      window.onGrecaptchaLoad = () => {
        if (isMounted) {
          renderWidget();
        }
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
        // Poll briefly until grecaptcha is ready
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

    return () => {
      isMounted = false;
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {}
      }
    };
  }, [siteKey, theme, onVerify, onExpire]);

  const retryLoad = () => {
    setLoadError(false);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
      <div ref={containerRef} id="recaptcha-widget-container" style={{ minHeight: '78px' }} />
      {loadError && (
        <div style={{ fontSize: '12px', color: '#b45309', background: '#fffbe8', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '8px', marginTop: '6px', textAlign: 'center' }}>
          ⚠️ Could not load Google reCAPTCHA (likely blocked by an adblocker or extension).
          <div style={{ marginTop: '4px' }}>
            <button 
              type="button" 
              onClick={retryLoad} 
              style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
            >
              🔄 Retry Loading reCAPTCHA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
