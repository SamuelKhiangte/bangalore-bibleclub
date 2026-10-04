import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface SimulatedSmsBannerProps {
  code: string;
  onAutofill: () => void;
  onDismiss: () => void;
}

export const SimulatedSmsBanner: React.FC<SimulatedSmsBannerProps> = ({
  code,
  onAutofill,
  onDismiss
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(194, 94, 48, 0.35)',
        borderRadius: '20px',
        padding: '12px 16px',
        boxShadow: '0 12px 30px rgba(60, 45, 30, 0.12), 0 0 20px rgba(194, 94, 48, 0.1)',
        animation: 'slideDownToast 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
      }}
      onClick={onAutofill}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <MessageSquare size={13} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            MESSAGES • NOW
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Bangalore BibleClub
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
            Your 6-digit code is <strong style={{ color: 'var(--accent-gold)', letterSpacing: '1px', fontSize: '14px' }}>{code}</strong>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAutofill();
          }}
        >
          <Sparkles size={12} />
          Autofill
        </button>
      </div>
    </div>
  );
};
