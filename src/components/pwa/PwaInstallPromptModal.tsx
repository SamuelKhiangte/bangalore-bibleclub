import React, { useState, useEffect } from 'react';
import { Smartphone, Share, PlusSquare, X, Check, Download } from 'lucide-react';
import { getDeferredPrompt, promptInstall, isIOS, isStandalone } from '../../services/pwa.ts';

interface PwaInstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallPromptModal: React.FC<PwaInstallPromptModalProps> = ({ isOpen, onClose }) => {
  const [canDirectInstall, setCanDirectInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);

  useEffect(() => {
    setCanDirectInstall(!!getDeferredPrompt());
    setIosDevice(isIOS());
    setInstalled(isStandalone());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (success) {
      setInstalled(true);
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 41, 32, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(28, 41, 32, 0.25)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(107, 142, 116, 0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* App Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(74, 124, 89, 0.25)',
            border: '2px solid rgba(74, 124, 89, 0.2)',
            marginBottom: '14px',
            backgroundColor: '#4A7C59'
          }}
        >
          <img src="./icons/icon-192.png" alt="Bangalore BibleClub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Bangalore BibleClub
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '20px' }}>
          Install as a mobile app on your iPhone or Android. No app store download needed!
        </p>

        {installed ? (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(74, 124, 89, 0.12)',
              borderRadius: '16px',
              color: 'var(--accent-gold)',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Check size={18} />
            <span>App already installed on Home Screen!</span>
          </div>
        ) : canDirectInstall ? (
          <button
            onClick={handleInstallClick}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '15px' }}
          >
            <Download size={18} />
            <span>Add to Home Screen</span>
          </button>
        ) : iosDevice ? (
          /* iOS Safari Step-by-Step Guide */
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(243, 246, 243, 0.9)',
              borderRadius: '18px',
              padding: '16px 14px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              How to install on iPhone & iPad:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#007AFF', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  <Share size={15} />
                </div>
                <span>1. Tap the <strong>Share</strong> button at bottom of Safari</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  <PlusSquare size={15} />
                </div>
                <span>2. Scroll down & select <strong>Add to Home Screen</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  <Smartphone size={15} />
                </div>
                <span>3. Open BibleClub from your Home Screen anytime</span>
              </div>
            </div>
          </div>
        ) : (
          /* General Android / Desktop Chrome Guide */
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(243, 246, 243, 0.9)',
              borderRadius: '18px',
              padding: '16px 14px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              How to install:
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              Tap your browser menu (<strong>⋮</strong> or <strong>Share</strong>) and choose <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
            </p>
          </div>
        )}

        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
          ✨ Works offline • Fullscreen • Instant push alerts
        </div>
      </div>
    </div>
  );
};
