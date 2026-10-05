import { useState, useEffect } from 'react';
import { Bell, BookOpen, CheckCheck } from 'lucide-react';
import { BibleRealDB } from '../../services/storage.ts';
import type { GroupNotification } from '../../types/index.ts';

interface NotificationDrawerProps {
  onSelectPost?: (postId: string) => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  onSelectPost
}) => {
  const [notifications, setNotifications] = useState<GroupNotification[]>([]);

  const reload = () => {
    setNotifications(BibleRealDB.getNotifications());
  };

  useEffect(() => {
    reload();
    const unsub = BibleRealDB.subscribe(() => {
      reload();
    });
    return unsub;
  }, []);

  const handleMarkAllRead = () => {
    BibleRealDB.markAllNotificationsRead();
  };

  return (
    <div style={{ padding: '16px 14px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}
          >
            circle notifications
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginTop: '2px'
            }}
          >
            Live updates when circle members finish their reading
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-main)'
            }}
          >
            <CheckCheck size={14} />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => notif.postId && onSelectPost?.(notif.postId)}
            className="glass-panel"
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: notif.postId ? 'pointer' : 'default',
              backgroundColor: notif.read ? 'rgba(255, 255, 255, 0.6)' : '#FFFFFF',
              border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--border-accent)',
              position: 'relative',
              boxShadow: notif.read ? 'none' : '0 4px 14px rgba(74, 124, 89, 0.12)'
            }}
          >
            {/* Unread Glowing Dot */}
            {!notif.read && (
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)'
                }}
              />
            )}

            <div style={{ position: 'relative' }}>
              <img
                src={notif.actorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={notif.actorName}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-emerald)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={10} strokeWidth={3} />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: notif.read ? 600 : 800, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {notif.message}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                {timeAgo(notif.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>No notifications yet</h4>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Notifications from your reading group will show here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
