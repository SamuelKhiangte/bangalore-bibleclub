import React from 'react';
import { BookOpen, Flame, Bell, Sparkles } from 'lucide-react';
import type { UserProfile, ActiveTab } from '../../types/index.ts';

interface TopHeaderProps {
  currentUser: UserProfile;
  activeTab: ActiveTab;
  unreadCount: number;
  onTabChange: (tab: ActiveTab) => void;
  onSimulateReading: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  activeTab,
  unreadCount,
  onTabChange,
  onSimulateReading
}) => {
  return (
    <header
      style={{
        height: '56px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(8, 12, 21, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Brand Logo & Name */}
      <div
        onClick={() => onTabChange('feed')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}
        >
          <BookOpen size={16} />
        </div>
        <span
          className="text-gold-gradient"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '-0.3px'
          }}
        >
          BibleReal
        </span>
      </div>

      {/* Right Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Simulate Reading Quick Button */}
        <button
          onClick={onSimulateReading}
          title="Simulate friend reading (triggers group notification)"
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid var(--border-accent)',
            borderRadius: '9999px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--accent-gold)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={12} />
          <span>Simulate</span>
        </button>

        {/* Streak Flame Pill */}
        <div
          onClick={() => onTabChange('progress')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--border-accent)',
            padding: '4px 9px',
            borderRadius: '9999px',
            cursor: 'pointer'
          }}
        >
          <Flame size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {currentUser.streakDays}
          </span>
        </div>

        {/* Notifications Bell Button */}
        <button
          onClick={() => onTabChange('notifications')}
          style={{
            position: 'relative',
            background: activeTab === 'notifications' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'notifications' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--accent-gold)',
                color: '#000',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                fontSize: '9px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px var(--accent-gold)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
