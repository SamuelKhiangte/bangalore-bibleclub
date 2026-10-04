import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, Sparkles } from 'lucide-react';
import { CircularProgress } from './CircularProgress.tsx';
import { BookChapterMatrix } from './BookChapterMatrix.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import { calculateBibleProgress } from '../../services/bibleTracker.ts';
import type { UserProfile } from '../../types/index.ts';

interface ProgressDashboardProps {
  currentUser: UserProfile;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ currentUser }) => {
  const [completedChapters, setCompletedChapters] = useState<Record<string, number[]>>({});

  const reloadData = () => {
    setCompletedChapters(BibleRealDB.getCompletedChapters());
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

  return (
    <div style={{ padding: '16px 14px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#F8FAFC' }}>
          Bible Journey Tracker
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Tracking your walk through all 66 books & 1,189 chapters.
        </p>
      </div>

      {/* Main Circular Progress Ring Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 20px',
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.12) 0%, rgba(16, 23, 38, 0.8) 75%)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)'
        }}
      >
        <CircularProgress
          percentage={stats.percentage}
          chaptersRead={stats.totalChaptersRead}
          totalChapters={stats.totalChapters}
        />

        {/* Quick Summary Pill Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
          {/* Daily Streak Card */}
          <div
            style={{
              padding: '12px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}
            >
              <Flame size={20} fill="var(--accent-gold)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC' }}>
                {currentUser.streakDays} Days
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Streak</div>
            </div>
          </div>

          {/* Chapters Left Card */}
          <div
            style={{
              padding: '12px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)'
              }}
            >
              <Trophy size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC' }}>
                {stats.totalChapters - stats.totalChaptersRead}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chapters Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testament Breakdown Bars */}
      <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
          Testament Breakdown
        </h3>

        {/* Old Testament */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Old Testament (39 Books)</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {stats.otChaptersRead} / {stats.otTotalChapters} ({stats.otPercentage}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stats.otPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
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
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stats.ntPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10B981, #34D399)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive 66 Books & Chapters Matrix */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>
          Chapters Checklist
        </h3>
        <BookChapterMatrix
          completedChapters={completedChapters}
          onToggleChapter={handleToggleChapter}
        />
      </div>
    </div>
  );
};
