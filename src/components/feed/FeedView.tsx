import React, { useState, useEffect } from 'react';
import { Plus, Users, Sparkles } from 'lucide-react';
import { ReadingPostCard } from './ReadingPostCard.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import type { ReadingPost, UserProfile } from '../../types/index.ts';

interface FeedViewProps {
  currentUser: UserProfile;
  onOpenCreatePost: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ currentUser, onOpenCreatePost }) => {
  const [posts, setPosts] = useState<ReadingPost[]>([]);

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

  const hasPostedToday = posts.some(
    (p) => p.userId === currentUser.id && new Date(p.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div style={{ padding: '16px 14px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Circle Story Avatars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          paddingBottom: '16px',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}
      >
        {/* User Story / Snap Button */}
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
              border: hasPostedToday ? '2px solid var(--accent-emerald)' : '2px dashed var(--accent-gold)'
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
                backgroundColor: hasPostedToday ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900
              }}
            >
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
            {hasPostedToday ? 'Your Post' : 'Post Reading'}
          </span>
        </div>

        {/* Friends Stories from Bangalore BibleClub */}
        {[
          { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', read: 'Hebrews 11', online: true },
          { name: 'David', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', read: 'John 1', online: true },
          { name: 'Michael', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', read: 'Romans 8', online: false },
          { name: 'Hannah', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', read: 'Psalms 23', online: false }
        ].map((friend) => (
          <div
            key={friend.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
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
                border: '2px solid var(--accent-gold)'
              }}
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
              {friend.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: 'var(--accent-emerald)',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                    border: '2px solid #FFFFFF'
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              {friend.name}
            </span>
          </div>
        ))}
      </div>

      {/* Daily Banner Callout if User Has Not Read Today */}
      {!hasPostedToday && (
        <div
          onClick={onOpenCreatePost}
          className="glass-panel"
          style={{
            padding: '16px 18px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 246, 243, 0.95) 100%)',
            border: '1px solid var(--border-accent)',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(74, 124, 89, 0.1)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Time for Today's Bible Reading!
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Snap your start & end verse to keep your reading streak alive.
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '20px', flexShrink: 0 }}
          >
            Snap Now
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {posts.map((post) => (
          <ReadingPostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onToggleReaction={handleToggleReaction}
            onAddComment={handleAddComment}
          />
        ))}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <Users size={40} color="var(--accent-gold)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>No posts yet today</h3>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              Be the first in Bangalore BibleClub to snap your reading journey!
            </p>
            <button
              className="btn-primary"
              onClick={onOpenCreatePost}
              style={{ marginTop: '16px' }}
            >
              Post First Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
