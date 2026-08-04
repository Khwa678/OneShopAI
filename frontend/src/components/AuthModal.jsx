import React, { useState, useEffect, useRef } from 'react';
import { X, CheckSquare, RefreshCw, Key, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { registerUser, loginUser, loginWithGoogle, resetPassword } from '../services/api';
import ReCaptcha from './ReCaptcha';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [gsiLoaded, setGsiLoaded] = useState(false);
  const recaptchaRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1076366621923-qpvjq3kndke06n5d2r6tivffie51dd8p.apps.googleusercontent.com';

  const formatErrorMessage = (err, defaultMsg = 'An unexpected error occurred.') => {
    if (!err) return '';
    if (typeof err === 'string') return err;
    if (err.response?.data?.error) {
      const e = err.response.data.error;
      if (typeof e === 'string') return e;
      if (typeof e === 'object' && e.message) return String(e.message);
      try { return JSON.stringify(e); } catch (_) { return defaultMsg; }
    }
    if (err.response?.data?.message) return String(err.response.data.message);
    if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
      return '🌐 Network Error: Unable to connect to backend server. If deployed on Render, the backend Web Service may be deploying or waking up from cold start. Please wait a few seconds and try again.';
    }
    if (err.message) return String(err.message);
    if (typeof err === 'object') {
      try { return JSON.stringify(err); } catch (_) { return defaultMsg; }
    }
    return String(err);
  };

  // Password strength checker helper
  const checkPasswordStrength = (pass) => {
    const hasMinLen = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
    return {
      hasMinLen,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isStrong: hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordRules = checkPasswordStrength(formData.password);

  // Sync mode with initialMode whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setErrorMsg('');
      setSuccessMsg('');
      setCaptchaToken('');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  }, [isOpen, initialMode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setCaptchaToken('');
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  // Initialize Real Google OAuth Identity Services
  useEffect(() => {
    if (isOpen && mode !== 'forgot' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });

        const container = document.getElementById('g_id_signin_container');
        if (container) {
          container.innerHTML = '';
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
          setGsiLoaded(true);
        }
      } catch (e) {
        console.warn('Google Identity Services notice:', e.message);
      }
    }
  }, [isOpen, mode, googleClientId]);

  if (!isOpen) return null;

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle({ credential: response.credential });
      if (res.data.token) localStorage.setItem('docs_playground_token', res.data.token);
      if (res.data.user) localStorage.setItem('docs_playground_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Google OAuth verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInDirect = async (email, name) => {
    if (!email || !email.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle({ email: email.trim(), name });
      if (res.data.token) localStorage.setItem('docs_playground_token', res.data.token);
      if (res.data.user) localStorage.setItem('docs_playground_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Google Sign-In failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please fill in all required fields.');
        }
        if (!passwordRules.isStrong) {
          throw new Error('Password is not strong enough! Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (e.g. Kishan@123).');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (!agreeTerms) {
          throw new Error('Please agree to the Terms of Service.');
        }
        const res = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          captchaToken
        });
        if (res.data.token) localStorage.setItem('docs_playground_token', res.data.token);
        if (res.data.user) localStorage.setItem('docs_playground_user', JSON.stringify(res.data.user));
        onAuthSuccess(res.data.user);
        onClose();
      } else if (mode === 'login') {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter your email and password.');
        }
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
          captchaToken
        });
        if (res.data.token) localStorage.setItem('docs_playground_token', res.data.token);
        if (res.data.user) localStorage.setItem('docs_playground_user', JSON.stringify(res.data.user));
        onAuthSuccess(res.data.user);
        onClose();
      } else if (mode === 'forgot') {
        if (!formData.email) {
          throw new Error('Please enter your registered Gmail email address.');
        }
        const res = await resetPassword({
          email: formData.email,
          captchaToken
        });
        setSuccessMsg(res.data.message || 'Password reset link has been sent to your Gmail inbox!');
      }
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'An unexpected error occurred.'));
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Auth Mode Toggle Tabs */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: mode === 'login' ? 700 : 600,
                fontSize: '14px',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#4f46e5' : '#64748b',
                boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: mode === 'register' ? 700 : 600,
                fontSize: '14px',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#4f46e5' : '#64748b',
                boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
            {mode === 'register' ? 'Create a Free DocsAI Account' : mode === 'login' ? 'Log In to DocsAI' : 'Reset Password'}
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
            {mode === 'register' ? 'Join over 10M+ users processing smart AI documents daily.' : mode === 'login' ? 'Access your saved documents and AI tools.' : 'Enter your email and new strong password.'}
          </p>
        </div>

        {/* Google Real OAuth Option */}
        {mode !== 'forgot' && (
          <div style={{ marginBottom: '16px' }}>
            {/* Real Google OAuth Button Container */}
            <div id="g_id_signin_container" style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center', marginBottom: '10px' }} />

            {!gsiLoaded && (
              <button 
                type="button" 
                onClick={() => {
                  if (window.google?.accounts?.id && googleClientId) {
                    try {
                      window.google.accounts.id.prompt();
                    } catch (e) {
                      setShowGooglePrompt(true);
                    }
                  } else {
                    setShowGooglePrompt(true);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google Account
              </button>
            )}

            {showGooglePrompt && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 8px 20px -5px rgba(0,0,0,0.08)', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Google Direct Sign-In
                  </div>
                  <button type="button" onClick={() => setShowGooglePrompt(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setGoogleEmailInput('user.playground@gmail.com'); handleGoogleSignInDirect('user.playground@gmail.com', 'Playground User'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>U</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Google User Account</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>user.playground@gmail.com</div>
                    </div>
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Or enter your Google Email:</div>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  className="form-input"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <button
                  type="button"
                  className="btn-modal-submit"
                  style={{ padding: '8px', fontSize: '13px', width: '100%', background: '#4f46e5' }}
                  onClick={() => handleGoogleSignInDirect(googleEmailInput, googleEmailInput.split('@')[0])}
                  disabled={!googleEmailInput.trim()}
                >
                  Sign In with Google Account
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password (e.g. Kishan@123)"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Live Strong Password Criteria Checklist for Register */}
          {mode === 'register' && formData.password.length > 0 && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '14px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Password Requirements (Example: <code>Kishan@123</code>):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <div style={{ color: passwordRules.hasMinLen ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordRules.hasMinLen ? <Check size={13} /> : <AlertCircle size={13} />} 8+ characters
                </div>
                <div style={{ color: passwordRules.hasUpper ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordRules.hasUpper ? <Check size={13} /> : <AlertCircle size={13} />} Uppercase (A-Z)
                </div>
                <div style={{ color: passwordRules.hasLower ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordRules.hasLower ? <Check size={13} /> : <AlertCircle size={13} />} Lowercase (a-z)
                </div>
                <div style={{ color: passwordRules.hasNumber ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordRules.hasNumber ? <Check size={13} /> : <AlertCircle size={13} />} Number (0-9)
                </div>
                <div style={{ color: passwordRules.hasSpecial ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', gridColumn: 'span 2' }}>
                  {passwordRules.hasSpecial ? <Check size={13} /> : <AlertCircle size={13} />} Special Symbol (@, #, $, !, %, etc.)
                </div>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Terms for Register */}
          {mode === 'register' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
              <input 
                type="checkbox" 
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="#" style={{ color: '#095475' }}>Terms of Service</a> and Privacy Statement.
              </label>
            </div>
          )}

          {/* Real Google reCAPTCHA Widget for Security Verification */}
          <ReCaptcha 
            ref={recaptchaRef}
            onVerify={(token) => setCaptchaToken(token)} 
            onExpire={() => setCaptchaToken('')} 
          />

          <button type="submit" className="btn-modal-submit" disabled={loading}>
            {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : mode === 'login' ? 'Log In' : 'Send Password Reset Email Link'}
          </button>
        </form>

        {/* Footer Mode Switcher Links */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#475569' }}>
          {mode === 'register' ? (
            <span>Already have an account? <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: '#095475', fontWeight: 700, cursor: 'pointer' }}>Log In</button></span>
          ) : mode === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>Don't have an account? <button type="button" onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: '#095475', fontWeight: 700, cursor: 'pointer' }}>Register free</button></span>
              <button type="button" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Forgot your password?</button>
            </div>
          ) : (
            <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: '#095475', fontWeight: 700, cursor: 'pointer' }}>Back to Log In</button>
          )}
        </div>
      </div>
    </div>
  );
}
