import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { resetPasswordWithToken } from '../services/api';

export default function ResetPasswordModal({ isOpen, token, onClose, onSuccessLogin }) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !token) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!passwordRules.isStrong) {
      setErrorMsg('Password is not strong enough! Must contain 8+ characters, uppercase (A-Z), lowercase (a-z), number (0-9), and special symbol (e.g. Kishan@123).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-type your confirm password.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithToken({
        token: token,
        newPassword: formData.password
      });
      setSuccessMsg(res.data.message || 'Your password has been reset successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) onSuccessLogin();
      }, 2500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to reset password.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Set New Password</h2>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
            Enter your new strong password below to complete your account recovery.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="New Strong Password (e.g. Kishan@123)"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Live Strong Password Checklist */}
          {formData.password.length > 0 && (
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

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-modal-submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#4f46e5' }}>
            {loading ? 'Updating Password...' : 'Save New Password & Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
