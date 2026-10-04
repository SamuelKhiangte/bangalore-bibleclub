import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ReactionsBarProps {
  currentUserId: string;
  reactions: Record<string, string[]>;
  commentsCount: number;
  onToggleReaction: (emoji: string) => void;
  onOpenComments: () => void;
}

const EMOJI_OPTIONS = [
  { emoji: '🙏', label: 'Amen' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💡', label: 'Inspired' },
  { emoji: '📖', label: 'Saved' }
];

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  currentUserId,
  reactions,
  commentsCount,
  onToggleReaction,
  onOpenComments
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '10px'
      }}
    >
      {/* RealMoji Christian Reactions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {EMOJI_OPTIONS.map(({ emoji, label }) => {
          const userList = reactions[emoji] || [];
          const hasReacted = userList.includes(currentUserId);
          const count = userList.length;

          return (
            <button
              key={emoji}
              title={label}
              onClick={() => onToggleReaction(emoji)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '9999px',
                background: hasReacted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: hasReacted ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transform: hasReacted ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '15px', lineHeight: 1 }}>{emoji}</span>
              {count > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: hasReacted ? 'var(--accent-gold)' : 'var(--text-secondary)'
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Comments Drawer Button */}
      <button
        onClick={onOpenComments}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '8px'
        }}
      >
        <MessageCircle size={16} />
        <span>{commentsCount}</span>
      </button>
    </div>
  );
};
