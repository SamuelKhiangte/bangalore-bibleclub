import React, { useState, useEffect } from 'react';
import { Plus, Check, Share2, Search, BookOpen } from 'lucide-react';
import { ReadingPostCard } from './ReadingPostCard.tsx';
import { BotanicalArt } from '../common/BotanicalArt.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import type { ReadingPost, UserProfile } from '../../types/index.ts';

interface FeedViewProps {
  currentUser: UserProfile;
  onOpenCreatePost: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ currentUser, onOpenCreatePost }) => {
  const [posts, setPosts] = useState<ReadingPost[]>([]);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const loadPosts = () => {
    setPosts(BibleRealDB.getPosts());
  };

  useEffect(() => {
    loadPosts();
    const unsubscribe = BibleRealDB.subscribe(() => {
      loadPosts();
    });
    return unsubscribe;
  }, []);

  const handleToggleReaction = (postId: string, emoji: string) => {
    BibleRealDB.toggleReaction(postId, emoji, currentUser.id);
  };

  const handleAddComment = (postId: string, text: string) => {
    BibleRealDB.addComment(postId, {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      text
    });
  };

  const handleInviteCircle = async () => {
    const inviteText = `Join my daily Bible reading circle on Bangalore BibleClub! Track chapters and share reflections together.`;
    const inviteUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bangalore BibleClub Invite',
          text: inviteText,
          url: inviteUrl
        });
        return;
      } catch {
        // Fallback to clipboard if user cancels or share fails
      }
    }

    try {
      await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2800);
    } catch {
      alert('Invite link: ' + inviteUrl);
    }
  };

  const hasPostedToday = posts.some(
    (p) => p.userId === currentUser.id && new Date(p.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div style={{ padding: '16px 16px 32px', maxWidth: '520px', margin: '0 auto' }}>
      {/* Toast Notification when invite link is copied */}
      {copiedInvite && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--text-primary)',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideDownToast 0.25s ease'
          }}
        >
          <Check size={14} color="#6E9F7C" />
          <span>Invite link copied to clipboard!</span>
        </div>
      )}

      {/* Editorial Hero Header (Inspired by reference aesthetic) */}
      <div
        style={{
          position: 'relative',
          padding: '24px 18px 20px',
          marginBottom: '20px',
          overflow: 'hidden',
          backgroundColor: '#FAF7F2',
          borderRadius: '26px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Botanical line-art illustration positioned on right */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '8px',
            opacity: 0.75,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <BotanicalArt width={95} height={145} color="var(--accent-gold)" />
        </div>

        {/* Editorial Title & Subtitle */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '270px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}
          >
            visit the word
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '16px',
              color: 'var(--accent-gold)',
              lineHeight: 1.2
            }}
          >
            Start your scripture journey
          </p>
        </div>

        {/* Editorial Pill Search / Scripture Jump Bar (matching the reference search bar) */}
        <div
          onClick={onOpenCreatePost}
          className="editorial-pill-search"
          style={{
            marginTop: '22px',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            justifyContent: 'space-between'
          }}
          title="Search books or log today's passage"
        >
          <span
            style={{
              fontFamily: 'var(--font-main)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)'
            }}
          >
            Log Reading • Start & End Verse
          </span>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(74, 124, 89, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}
          >
            <Search size={14} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* Circle Stories & Member Actions (Real Members Only) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}
      >
        {/* Real User's Story */}
        <div
          onClick={onOpenCreatePost}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              padding: '2px',
              border: hasPostedToday ? '2px solid var(--accent-gold)' : '2px dashed var(--accent-gold-light)',
              backgroundColor: '#FFFFFF'
            }}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: hasPostedToday ? 'var(--accent-gold)' : 'var(--accent-gold-light)',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {hasPostedToday ? <Check size={11} strokeWidth={3} /> : <Plus size={11} strokeWidth={3} />}
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {hasPostedToday ? 'Logged' : 'You'}
          </span>
        </div>

        {/* Real Circle Invite Button */}
        <div
          onClick={handleInviteCircle}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1.5px dashed var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              color: 'var(--accent-gold)',
              transition: 'all 0.2s ease'
            }}
          >
            <Share2 size={18} strokeWidth={1.8} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Invite
          </span>
        </div>

        {/* Circle Info Tag */}
        <div
          style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            borderRadius: '9999px',
            backgroundColor: '#FAF7F2',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            Bangalore Circle
          </span>
        </div>
      </div>

      {/* Daily Callout Card (Editorial Browser-Frame Style) */}
      {!hasPostedToday && (
        <div
          onClick={onOpenCreatePost}
          className="editorial-browser-frame"
          style={{
            marginBottom: '24px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Top Browser Bar Dots */}
          <div className="editorial-browser-header">
            <div className="browser-dots">
              <div className="browser-dot" />
              <div className="browser-dot" />
              <div className="browser-dot" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '12px',
                color: 'var(--accent-gold)'
              }}
            >
              daily reflection
            </span>
          </div>

          <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em'
                }}
              >
                Today's Scripture Reading
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                Dual photo capture of your start verse & end verse.
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '9px 16px', fontSize: '12px', borderRadius: '9999px', flexShrink: 0 }}
            >
              Begin
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {posts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 12px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
              today's circle snaps
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
              24h Daily Refresh
            </span>
          </div>
        )}

        {posts.map((post) => (
          <ReadingPostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onToggleReaction={handleToggleReaction}
            onAddComment={handleAddComment}
          />
        ))}

        {/* Real-Use Empty State with Botanical Line Art */}
        {posts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              backgroundColor: '#FAF7F2',
              borderRadius: '26px',
              border: '1px solid var(--border-subtle)',
              margin: '10px 0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <BotanicalArt width={70} height={105} color="var(--accent-gold)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              your circle is quiet today
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '15px',
                color: 'var(--text-secondary)',
                marginTop: '8px',
                maxWidth: '290px',
                margin: '8px auto 0',
                lineHeight: 1.4
              }}
            >
              Feed photos refresh every 24 hours. Be the first to snap today's reading or invite friends to your circle.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '22px' }}>
              <button
                className="btn-primary"
                onClick={onOpenCreatePost}
                style={{ padding: '10px 20px', borderRadius: '9999px', fontSize: '13px' }}
              >
                <BookOpen size={14} />
                <span>Log Today's Reading</span>
              </button>
              <button
                className="btn-secondary"
                onClick={handleInviteCircle}
                style={{ padding: '10px 18px', borderRadius: '9999px', fontSize: '13px' }}
              >
                <Share2 size={13} />
                <span>Invite Circle</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
