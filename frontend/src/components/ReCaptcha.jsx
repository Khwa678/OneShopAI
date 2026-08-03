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
        setTimeout(() => clearInterval(interval), 5000);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
      <div ref={containerRef} id="recaptcha-widget-container" style={{ minHeight: '78px' }} />
      {loadError && (
        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', textAlign: 'center' }}>
          ⚠️ Could not load Google reCAPTCHA script. Please check your network connection.
        </div>
      )}
    </div>
  );
}
