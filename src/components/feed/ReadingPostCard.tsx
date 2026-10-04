import React, { useState } from 'react';
import { BookOpen, Flame, Clock } from 'lucide-react';
import { BeRealCardPreview } from '../camera/BeRealCardPreview.tsx';
import { ReactionsBar } from './ReactionsBar.tsx';
import { CommentsDrawer } from './CommentsDrawer.tsx';
import type { ReadingPost, UserProfile } from '../../types/index.ts';

interface ReadingPostCardProps {
  post: ReadingPost;
  currentUser: UserProfile;
  onToggleReaction: (postId: string, emoji: string) => void;
  onAddComment: (postId: string, text: string) => void;
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

export const ReadingPostCard: React.FC<ReadingPostCardProps> = ({
  post,
  currentUser,
  onToggleReaction,
  onAddComment
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const passageTitle = `${post.bookName} ${post.startChapter}:${post.startVerse}${
    post.startChapter === post.endChapter
      ? post.startVerse === post.endVerse ? '' : `–${post.endVerse}`
      : ` – ${post.endChapter}:${post.endVerse}`
  }`;

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '20px',
        backgroundColor: 'rgba(16, 23, 38, 0.75)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      {/* Post Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={post.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={post.userName}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-accent)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                {post.userName}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'var(--accent-gold)'
                }}
              >
                <Flame size={11} fill="var(--accent-gold)" />
                <span>Active</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {timeAgo(post.createdAt)}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={10} />
                {post.durationMinutes}m read
              </span>
            </div>
          </div>
        </div>

        {/* Bible Reference Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15))',
            border: '1px solid var(--border-accent)',
            borderRadius: '9999px',
            padding: '5px 10px',
            color: 'var(--accent-gold)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <BookOpen size={13} />
          <span>{passageTitle}</span>
        </div>
      </div>

      {/* BeReal Dual Photo Experience Card */}
      <div style={{ padding: '0 12px' }}>
        <BeRealCardPreview
          startPhoto={post.startPhotoUrl}
          endPhoto={post.endPhotoUrl}
          isInteractive={true}
          startLabel="Start Verse"
          endLabel="End Verse"
        />
      </div>

      {/* Reflection Note */}
      {post.reflection && (
        <div
          style={{
            margin: '12px 14px 0',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderLeft: '3px solid var(--accent-gold)',
            fontSize: '13px',
            lineHeight: '1.45',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}
        >
          "{post.reflection}"
        </div>
      )}

      {/* Reactions Bar */}
      <ReactionsBar
        currentUserId={currentUser.id}
        reactions={post.reactions || {}}
        commentsCount={post.comments?.length || 0}
        onToggleReaction={(emoji) => onToggleReaction(post.id, emoji)}
        onOpenComments={() => setIsCommentsOpen(true)}
      />

      {/* Comments Drawer */}
      <CommentsDrawer
        post={post}
        currentUser={currentUser}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        onAddComment={(text) => onAddComment(post.id, text)}
      />
    </div>
  );
};
