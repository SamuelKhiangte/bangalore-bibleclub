import { useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import type { GroupNotification } from '../../types/index.ts';

interface NotificationBannerProps {
  notification: GroupNotification | null;
  onDismiss: () => void;
  onClick: (notification: GroupNotification) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  onClick
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5500);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div
      onClick={() => onClick(notification)}
      style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-accent)',
        borderRadius: '20px',
        padding: '12px 16px',
        boxShadow: '0 12px 32px rgba(35, 60, 42, 0.15), 0 0 20px rgba(74, 124, 89, 0.12)',
        animation: 'slideDownToast 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={notification.actorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={notification.actorName}
          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            backgroundColor: 'var(--accent-emerald)',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <BookOpen size={9} strokeWidth={3} />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            BANGALORE BIBLECLUB ALERT
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• Just now</span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {notification.message}
        </div>
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
          padding: '4px',
          cursor: 'pointer'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
