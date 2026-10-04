import React, { useState, useEffect } from 'react';
import { BookOpen, Phone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { OtpInput } from './OtpInput.tsx';
import { SimulatedSmsBanner } from './SimulatedSmsBanner.tsx';
import { ProfileSetupModal } from './ProfileSetupModal.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import type { UserProfile } from '../../types/index.ts';

interface PhoneAuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India (Bangalore)' },
  { code: '+1', flag: '🇺🇸', name: 'United States / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' }
];

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('9845012345');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Countdown timer for resend
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, countdown]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneDigits.trim()) return;

    // Generate random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError(false);
    setCountdown(30);
    setStep('otp');

    setTimeout(() => {
      setShowSmsBanner(true);
    }, 600);
  };

  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || enteredOtp;
    if (code === generatedOtp || code === '123456') {
      const existing = BibleRealDB.getUser();
      const fullPhone = `${selectedCountry}${phoneDigits}`;
      if (existing && existing.phoneNumber === fullPhone) {
        onLoginSuccess(existing);
      } else {
        setStep('profile');
      }
    } else {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 2000);
    }
  };

  const handleAutofill = () => {
    setEnteredOtp(generatedOtp);
    setShowSmsBanner(false);
    handleVerifyOtp(generatedOtp);
  };

  const handleProfileComplete = (user: UserProfile) => {
    BibleRealDB.setUser(user);
    onLoginSuccess(user);
  };

  if (step === 'profile') {
    return (
      <ProfileSetupModal
        phoneNumber={`${selectedCountry}${phoneDigits}`}
        onComplete={handleProfileComplete}
      />
    );
  }

  return (
    <div
      style={{
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {showSmsBanner && (
        <SimulatedSmsBanner
          code={generatedOtp}
          onAutofill={handleAutofill}
          onDismiss={() => setShowSmsBanner(false)}
        />
      )}

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(74, 124, 89, 0.2), rgba(49, 89, 61, 0.12))',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--accent-gold)',
            boxShadow: '0 8px 24px rgba(74, 124, 89, 0.18)'
          }}
        >
          <BookOpen size={34} strokeWidth={2.2} />
        </div>
        <h1
          className="text-gold-gradient"
          style={{ fontFamily: 'var(--font-display)', fontSize: '27px', fontWeight: 800, letterSpacing: '-0.4px' }}
        >
          Bangalore BibleClub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>
          Your cozy daily space to read, reflect & share Scripture
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <Phone size={14} color="var(--accent-gold)" />
              <span>Enter Mobile Number</span>
            </label>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} style={{ background: '#FFFBF5', color: '#2C2520' }}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                required
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                placeholder="98450 12345"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  outline: 'none',
                  fontFamily: 'var(--font-main)'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={13} color="var(--accent-emerald)" />
              <span>We'll send a 6-digit confirmation code via simulated SMS.</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            <span>Send Verification Code</span>
            <ArrowRight size={18} />
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Confirm your code
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Sent to <strong style={{ color: 'var(--text-primary)' }}>{selectedCountry} {phoneDigits}</strong>
            </p>
          </div>

          <OtpInput
            value={enteredOtp}
            onChange={(val) => {
              setEnteredOtp(val);
              if (val.length === 6) {
                handleVerifyOtp(val);
              }
            }}
            hasError={otpError}
          />

          {otpError && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
              Incorrect code. Please check SMS banner or tap Autofill.
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginBottom: '14px' }}
            disabled={enteredOtp.length < 6}
            onClick={() => handleVerifyOtp()}
          >
            <span>Verify & Continue</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
            <button
              onClick={() => setStep('phone')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Change Mobile Number
            </button>

            <button
              disabled={countdown > 0}
              onClick={handleSendCode}
              style={{
                background: 'none',
                border: 'none',
                color: countdown > 0 ? 'var(--text-muted)' : 'var(--accent-gold)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: countdown > 0 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-display)'
              }}
            >
              <RefreshCw size={12} />
              {countdown > 0 ? `Resend (${countdown}s)` : 'Resend Code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
