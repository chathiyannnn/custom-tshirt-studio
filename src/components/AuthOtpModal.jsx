import React, { useState } from 'react';
import { Phone, Lock, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthOtpModal({ isOpen, onClose, designSummary, onConfirmOrder }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = e => {
    e.preventDefault();
    if (phone.length < 8) return;
    setStep('otp');
  };

  const handleOtpChange = (i, v) => {
    if (v.length > 1) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleVerify = e => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep('success');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 800);
  };

  const panelStyle = {
    width: '100%', maxWidth: '420px',
    background: 'var(--white)',
    borderRadius: 'var(--r-xl)',
    border: '1px solid var(--cream-deep)',
    boxShadow: 'var(--shadow-lg)',
    padding: '36px 32px',
    position: 'relative'
  };

  return (
    <div className="modal-overlay">
      <div style={panelStyle}>
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', top: '16px', right: '16px' }}>✕</button>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                borderRadius: '50%', margin: '0 auto 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-gold)'
              }}>
                <Phone size={24} color="white" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '6px' }}>
                Verify Your Number
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--brown-light)' }}>
                Get WhatsApp OTP and real-time order updates
              </p>
            </div>

            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brown-mid)', display: 'block', marginBottom: '8px' }}>
              WhatsApp Mobile Number
            </label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--brown-mid)',
                fontFamily: 'var(--font-mono)'
              }}>+91</span>
              <input
                className="input-field"
                style={{ paddingLeft: '48px', fontFamily: 'var(--font-mono)' }}
                type="tel" required
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <button className="btn-gold" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              Send WhatsApp OTP <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'var(--cream)',
                border: '2px solid var(--gold)',
                borderRadius: '50%', margin: '0 auto 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Lock size={24} color="var(--gold-dark)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '6px' }}>
                Enter OTP Code
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--brown-light)' }}>
                Sent to <strong style={{ color: 'var(--brown)' }}>+91 {phone}</strong>
              </p>
              <div style={{
                marginTop: '8px', padding: '6px 14px',
                background: 'var(--cream)', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--cream-deep)',
                fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--brown-mid)',
                display: 'inline-block'
              }}>
                Demo code: <strong style={{ color: 'var(--gold-dark)' }}>492015</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((d, i) => (
                <input
                  key={i} id={`otp-${i}`}
                  type="text" maxLength={1} value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  style={{
                    width: '46px', height: '52px',
                    textAlign: 'center', fontSize: '1.1rem', fontWeight: 700,
                    fontFamily: 'var(--font-mono)', color: 'var(--brown)',
                    background: 'var(--white)', border: '2px solid var(--cream-deep)',
                    borderRadius: 'var(--r-md)', outline: 'none', transition: 'border-color 0.15s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-deep)'}
                />
              ))}
            </div>

            <button className="btn-brown" type="submit" disabled={verifying}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', opacity: verifying ? 0.7 : 1 }}>
              {verifying ? 'Verifying…' : 'Verify & Continue →'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'rgba(46,125,50,0.08)',
              border: '2px solid var(--success)',
              borderRadius: '50%', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle size={30} color="var(--success)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '6px' }}>
              Verified!
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--brown-light)', marginBottom: '20px' }}>
              +91 {phone} confirmed. Your design is ready.
            </p>

            <div style={{
              background: 'var(--cream)', borderRadius: 'var(--r-md)',
              padding: '14px 16px', marginBottom: '20px',
              border: '1px solid var(--cream-deep)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--brown-mid)' }}>
                <span>Size</span><strong style={{ color: 'var(--brown)' }}>{designSummary.size}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brown-mid)' }}>
                <span>Total</span>
                <strong style={{ color: 'var(--gold-dark)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>₹{designSummary.price}</strong>
              </div>
            </div>

            <button className="btn-gold" onClick={() => { onConfirmOrder(phone); onClose(); }}
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
