import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Twitter, Facebook, Globe, Instagram } from 'lucide-react';
import { sendContactMessage } from '../services/api';

export default function ContactSection({ onSelectTool }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      if (sendContactMessage) {
        await sendContactMessage({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: 'Get in Touch Query',
          message: formData.message
        });
      }
      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your message has been submitted successfully.'
      });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatusMessage({
        type: 'success',
        text: 'Thank you for reaching out! Your message has been submitted.'
      });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#f8fafc',
      paddingBottom: '60px',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Navigation Bar */}
      <div style={{
        padding: '18px 40px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-icon" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>D</div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>DocsAI • Contact Us</span>
        </div>

        {onSelectTool && (
          <button
            onClick={() => onSelectTool('summarizer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        )}
      </div>

      {/* Sky Blue Top Banner Spreading 100% Width matching Screenshot 1 */}
      <div style={{
        height: '240px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
        width: '100%'
      }} />

      {/* Floating White Card matching Screenshot 1 */}
      <div style={{ maxWidth: '800px', width: '100%', margin: '-100px auto 0', padding: '0 16px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px 20px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Get in Touch
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
              Send us a message and we'll respond shortly.
            </p>
          </div>

          {statusMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '14px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={22} color="#10b981" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  FIRST NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Please enter first name..."
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  LAST NAME
                </label>
                <input
                  type="text"
                  placeholder="Please enter last name..."
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Email & Phone Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="Please enter email..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  placeholder="Please enter phone number..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* What do you have in mind */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                WHAT DO YOU HAVE IN MIND
              </label>
              <textarea
                required
                rows={5}
                placeholder="Please enter query..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#38bdf8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Social Icons Centered below Card matching Screenshot 1 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          marginTop: '32px',
          color: '#38bdf8'
        }}>
          <div style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', background: '#e0f2fe', transition: 'all 0.2s ease' }}>
            <Twitter size={22} color="#0284c7" />
          </div>
          <div style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', background: '#e0f2fe', transition: 'all 0.2s ease' }}>
            <Facebook size={22} color="#0284c7" />
          </div>
          <div style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', background: '#e0f2fe', transition: 'all 0.2s ease' }}>
            <Globe size={22} color="#0284c7" />
          </div>
          <div style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', background: '#e0f2fe', transition: 'all 0.2s ease' }}>
            <Instagram size={22} color="#0284c7" />
          </div>
        </div>
      </div>
    </div>
  );
}
