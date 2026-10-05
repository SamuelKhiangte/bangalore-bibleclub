import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Share2, BookOpen, Crown } from 'lucide-react';
import { CircularProgress } from './CircularProgress.tsx';
import { BookChapterMatrix } from './BookChapterMatrix.tsx';
import { BotanicalArt } from '../common/BotanicalArt.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import { calculateBibleProgress } from '../../services/bibleTracker.ts';
import type { UserProfile, LeaderboardEntry } from '../../types/index.ts';

interface ProgressDashboardProps {
  currentUser: UserProfile;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'progress' | 'leaderboard'>('progress');
  const [completedChapters, setCompletedChapters] = useState<Record<string, number[]>>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const reloadData = () => {
    setCompletedChapters(BibleRealDB.getCompletedChapters());
    setLeaderboard(BibleRealDB.getLeaderboard());
  };

  useEffect(() => {
    reloadData();
    const unsub = BibleRealDB.subscribe(() => {
      reloadData();
    });
    return unsub;
  }, []);

  const stats = calculateBibleProgress(completedChapters);

  const handleToggleChapter = (bookId: string, ch: number) => {
    BibleRealDB.toggleChapter(bookId, ch);
  };

  const handleInviteFriends = async () => {
    const inviteText = `I've read ${stats.totalChaptersRead} Bible chapters on Bangalore BibleClub! Join our circle and let's compete on the leaderboard together.`;
    const inviteUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bangalore BibleClub Reading Leaderboard',
          text: inviteText,
          url: inviteUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2500);
    } catch {
      alert('Invite link: ' + inviteUrl);
    }
  };

  return (
    <div style={{ padding: '16px 16px 40px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Invite Toast */}
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          Leaderboard challenge link copied!
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          position: 'relative',
          padding: '22px 18px',
          overflow: 'hidden',
          backgroundColor: '#FAF7F2',
          borderRadius: '26px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '6px',
            opacity: 0.7,
            pointerEvents: 'none'
          }}
        >
          <BotanicalArt width={85} height={135} color="var(--accent-gold)" />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '280px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            Scripture Journey
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '34px',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginTop: '4px',
              marginBottom: '6px'
            }}
          >
            bible tracker
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.35
            }}
          >
            Tracking your walk through all 66 books & 1,189 chapters.
          </p>
        </div>

        {/* Sub-Tab Switcher Pill: My Progress vs Leaderboard */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '3px',
            borderRadius: '9999px',
            border: '1px solid var(--border-subtle)',
            marginTop: '18px',
            position: 'relative',
            zIndex: 1,
            width: 'fit-content'
          }}
        >
          <button
            onClick={() => setActiveSubTab('progress')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeSubTab === 'progress' ? 'var(--accent-gold)' : 'transparent',
              color: activeSubTab === 'progress' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            My Progress
          </button>
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeSubTab === 'leaderboard' ? 'var(--accent-gold)' : 'transparent',
              color: activeSubTab === 'leaderboard' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trophy size={13} />
            <span>Circle Leaderboard</span>
          </button>
        </div>
      </div>

      {/* --- Tab 1: My Progress --- */}
      {activeSubTab === 'progress' && (
        <>
          {/* Main Circular Progress Ring Card */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 6px 24px rgba(35, 60, 42, 0.05)'
            }}
          >
            <CircularProgress
              percentage={stats.percentage}
              chaptersRead={stats.totalChaptersRead}
              totalChapters={stats.totalChapters}
            />

            {/* Quick Summary Pill Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '22px' }}>
              {/* Daily Streak Card */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
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
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {currentUser.streakDays} Days
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Streak</div>
                </div>
              </div>

              {/* Chapters Left Card */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
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
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {stats.totalChapters - stats.totalChaptersRead}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chapters Left</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testament Breakdown Bars */}
          <div className="glass-panel" style={{ padding: '18px 20px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              Testament Progress
            </h3>

            {/* Old Testament */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Old Testament (39 Books)</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {stats.otChaptersRead} / {stats.otTotalChapters} ({stats.otPercentage}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#EAE6DC', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${stats.otPercentage}%`,
                    height: '100%',
                    background: 'var(--accent-gold)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>

            {/* New Testament */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>New Testament (27 Books)</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {stats.ntChaptersRead} / {stats.ntTotalChapters} ({stats.ntPercentage}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#EAE6DC', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${stats.ntPercentage}%`,
                    height: '100%',
                    background: 'var(--accent-gold-light)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive 66 Books & Chapters Matrix */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}
            >
              Chapters Checklist
            </h3>
            <BookChapterMatrix
              completedChapters={completedChapters}
              onToggleChapter={handleToggleChapter}
            />
          </div>
        </>
      )}

      {/* --- Tab 2: Circle Leaderboard --- */}
      {activeSubTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Podium Card */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 16px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '26px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '18px' }}>
              <Crown size={20} color="var(--accent-gold)" />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                reading circle podium
              </h2>
            </div>

            {/* Podium Display (2nd, 1st, 3rd) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '12px',
                padding: '10px 0 16px'
              }}
            >
              {/* 2nd Place */}
              {leaderboard[1] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={leaderboard[1].userAvatar}
                      alt={leaderboard[1].userName}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C0C0C0' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#C0C0C0',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      2
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '10px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {leaderboard[1].userName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {leaderboard[1].chaptersRead} ch
                  </span>
                  <div style={{ width: '100%', height: '50px', backgroundColor: '#EAE6DC', borderRadius: '8px 8px 0 0', marginTop: '6px' }} />
                </div>
              )}

              {/* 1st Place (Winner Center) */}
              {leaderboard[0] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '92px' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'var(--accent-gold)'
                      }}
                    >
                      <Crown size={18} />
                    </div>
                    <img
                      src={leaderboard[0].userAvatar}
                      alt={leaderboard[0].userName}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-gold)' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--accent-gold)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      1
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, marginTop: '10px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {leaderboard[0].userName}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 800 }}>
                    {leaderboard[0].chaptersRead} ch
                  </span>
                  <div style={{ width: '100%', height: '74px', backgroundColor: 'var(--accent-gold)', opacity: 0.85, borderRadius: '8px 8px 0 0', marginTop: '6px' }} />
                </div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={leaderboard[2].userAvatar}
                      alt={leaderboard[2].userName}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #CD7F32' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#CD7F32',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      3
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '10px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {leaderboard[2].userName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {leaderboard[2].chaptersRead} ch
                  </span>
                  <div style={{ width: '100%', height: '36px', backgroundColor: '#E5DED0', borderRadius: '8px 8px 0 0', marginTop: '6px' }} />
                </div>
              )}
            </div>

            <button
              onClick={handleInviteFriends}
              className="btn-secondary"
              style={{
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '12px',
                marginTop: '12px'
              }}
            >
              <Share2 size={13} />
              <span>Invite Friends to Compete</span>
            </button>
          </div>

          {/* Full Ranked Leaderboard List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                paddingLeft: '4px'
              }}
            >
              all circle participants
            </h3>

            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className="glass-panel"
                style={{
                  padding: '14px 16px',
                  borderRadius: '18px',
                  backgroundColor: entry.isCurrentUser ? '#FAF7F2' : '#FFFFFF',
                  border: entry.isCurrentUser ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(35, 60, 42, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Rank badge */}
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor:
                        entry.rank === 1 ? 'var(--accent-gold)' : entry.rank === 2 ? '#B0B0B0' : entry.rank === 3 ? '#CD7F32' : '#F0EFEA',
                      color: entry.rank <= 3 ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {entry.rank}
                  </span>

                  <img
                    src={entry.userAvatar}
                    alt={entry.userName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        {entry.userName}
                      </span>
                      {entry.isCurrentUser && (
                        <span
                          style={{
                            fontSize: '10px',
                            backgroundColor: 'var(--accent-gold)',
                            color: '#FFFFFF',
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            fontWeight: 700
                          }}
                        >
                          You
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>{entry.percentageCompleted}% completed</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-gold)' }}>
                        <Flame size={11} fill="var(--accent-gold)" />
                        {entry.streakDays}d streak
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {entry.chaptersRead}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    chapters
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
