import React, { useState, useEffect } from 'react';
import { Phone, Flame, BookOpen, Users, LogOut, Smartphone, Download, Calendar, Sparkles } from 'lucide-react';
import { BibleRealDB } from '../../services/storage.ts';
import { calculateBibleProgress } from '../../services/bibleTracker.ts';
import { BotanicalArt } from '../common/BotanicalArt.tsx';
import type { UserProfile, ReadingPost } from '../../types/index.ts';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenInstall?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onOpenInstall }) => {
  const [completedChapters, setCompletedChapters] = useState<Record<string, number[]>>({});
  const [archivePosts, setArchivePosts] = useState<ReadingPost[]>([]);

  const reloadData = () => {
    setCompletedChapters(BibleRealDB.getCompletedChapters());
    setArchivePosts(BibleRealDB.getUserArchive(user.id));
  };

  useEffect(() => {
    reloadData();
    const unsub = BibleRealDB.subscribe(() => {
      reloadData();
    });
    return unsub;
  }, [user.id]);

  const stats = calculateBibleProgress(completedChapters);

  return (
    <div style={{ padding: '20px 16px 40px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Profile Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 20px',
          textAlign: 'center',
          borderRadius: '26px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: '#FAF7F2',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-10px', right: '4px', opacity: 0.6, pointerEvents: 'none' }}>
          <BotanicalArt width={70} height={110} color="var(--accent-gold)" />
        </div>

        <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 14px' }}>
          <img
            src={user.avatarUrl}
            alt={user.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--accent-gold)',
              boxShadow: '0 4px 16px rgba(74, 124, 89, 0.2)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: 'var(--accent-gold)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              border: '3px solid #FFF'
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.015em'
          }}
        >
          {user.name}
        </h2>
        <span
          style={{
            fontSize: '13px',
            color: 'var(--accent-gold)',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic'
          }}
        >
          @{user.username}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Phone size={12} />
          <span>{user.phoneNumber}</span>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div
          className="glass-panel"
          style={{
            padding: '14px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(74, 124, 89, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}
          >
            <Flame size={20} fill="var(--accent-gold)" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {user.streakDays} Days
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Streak</div>
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '14px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(74, 124, 89, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {stats.totalChaptersRead} Chs
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bible Completed</div>
          </div>
        </div>
      </div>

      {/* Scripture Memories & Reading Archive (Permanent Data) */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          borderRadius: '22px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--accent-gold)" />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              my scripture memories
            </h3>
          </div>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              fontFamily: 'var(--font-display)'
            }}
          >
            {archivePosts.length} snaps saved
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          While feed photos refresh daily for friends, all your personal reading captures and notes stay permanently saved here.
        </p>

        {archivePosts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              backgroundColor: '#FAF7F2',
              borderRadius: '16px',
              color: 'var(--text-muted)',
              fontSize: '13px'
            }}
          >
            <Sparkles size={20} color="var(--accent-gold)" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <div>No past reading memories yet.</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>
              Your dual-photo captures will form a permanent visual journal here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {archivePosts.map((post) => (
              <div
                key={post.id}
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#FAF7F2',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                  <img
                    src={post.startPhotoUrl}
                    alt={post.bookName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {post.endPhotoUrl && (
                    <img
                      src={post.endPhotoUrl}
                      alt="End Verse"
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        right: '6px',
                        width: '36%',
                        aspectRatio: '1',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: '1.5px solid #FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}
                    />
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {post.bookName} {post.startChapter}:{post.startVerse}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Install Mobile PWA Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 18px',
          borderRadius: '20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(74, 124, 89, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}
          >
            <Smartphone size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Install on Mobile (PWA)
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Add to Home Screen on iOS or Android for an instant, app-like reading experience.
            </p>
          </div>
        </div>

        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '9999px' }}
          >
            <Download size={14} />
            <span>Add to Home Screen / Install</span>
          </button>
        )}
      </div>

      {/* Circle Info */}
      <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '20px', backgroundColor: '#FAF7F2', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Bangalore BibleClub Circle
            </span>
          </div>
          <span style={{ padding: '3px 8px', fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, borderRadius: '9999px', backgroundColor: '#FFFFFF' }}>
            Active Circle
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          You are an active reader in the Bangalore BibleClub fellowship. Daily reading captures refresh every 24 hours in the community feed, while your questions and prayer requests remain active.
        </p>
      </div>

      {/* Log Out Button */}
      <button
        onClick={onLogout}
        className="btn-secondary"
        style={{
          width: '100%',
          padding: '12px',
          color: 'var(--accent-rose)',
          borderColor: 'rgba(194, 75, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontFamily: 'var(--font-display)'
        }}
      >
        <LogOut size={15} />
        <span>Log Out of Bangalore BibleClub</span>
      </button>
    </div>
  );
};
