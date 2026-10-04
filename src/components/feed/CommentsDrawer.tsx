import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { ReadingPost, UserProfile } from '../../types/index.ts';

interface CommentsDrawerProps {
  post: ReadingPost;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  post,
  currentUser,
  isOpen,
  onClose,
  onAddComment
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  };

  const quickReplies = ['Amen! 🙏', 'So inspiring ❤️', 'Fire verse! 🔥', 'Glory to God ✨'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '1px solid var(--border-subtle)',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>
              Comments & Encouragement
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {post.userName}'s reading • {post.bookName} {post.startChapter}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {post.comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              No comments yet. Be the first to encourage {post.userName.split(' ')[0]}!
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                <img
                  src={comment.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={comment.userName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                      {comment.userName}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', gap: '6px', padding: '0 16px 8px', overflowX: 'auto' }}>
          {quickReplies.map((r) => (
            <button
              key={r}
              onClick={() => onAddComment(r)}
              style={{
                whiteSpace: 'nowrap',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(10, 15, 29, 0.95)'
          }}
        >
          <input
            type="text"
            placeholder="Add an encouraging word..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '10px 16px',
              borderRadius: '9999px',
              fontSize: '13px'
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
