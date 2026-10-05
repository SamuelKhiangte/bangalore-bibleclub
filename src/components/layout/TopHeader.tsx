import React from 'react';
import { BookOpen, Flame, Bell, Smartphone } from 'lucide-react';
import type { UserProfile, ActiveTab } from '../../types/index.ts';

interface TopHeaderProps {
  currentUser: UserProfile;
  activeTab: ActiveTab;
  unreadCount: number;
  onTabChange: (tab: ActiveTab) => void;
  onOpenInstall?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  activeTab,
  unreadCount,
  onTabChange,
  onOpenInstall
}) => {
  return (
    <header
      style={{
        height: '62px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(243, 246, 243, 0.94)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Brand Logo & Editorial Title */}
      <div
        onClick={() => onTabChange('feed')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '12px',
            backgroundColor: 'rgba(74, 124, 89, 0.12)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}
        >
          <BookOpen size={17} strokeWidth={1.8} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--text-primary)'
            }}
          >
            bangalore bibleclub
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '12px',
              color: 'var(--accent-gold)',
              lineHeight: 1
            }}
          >
            daily scripture journey
          </span>
        </div>
      </div>

      {/* Right Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Install Mobile PWA Button */}
        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            title="Install App on Phone / Add to Home Screen"
            style={{
              background: 'rgba(74, 124, 89, 0.1)',
              border: '1px solid var(--border-accent)',
              borderRadius: '9999px',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent-gold)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-main)'
            }}
          >
            <Smartphone size={12} />
            <span>Install</span>
          </button>
        )}

        {/* Streak Flame Pill */}
        <div
          onClick={() => onTabChange('progress')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(74, 124, 89, 0.1)',
            border: '1px solid var(--border-accent)',
            padding: '4px 9px',
            borderRadius: '9999px',
            cursor: 'pointer'
          }}
        >
          <Flame size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}>
            {currentUser.streakDays}
          </span>
        </div>

        {/* Notifications Bell Button */}
        <button
          onClick={() => onTabChange('notifications')}
          style={{
            position: 'relative',
            background: activeTab === 'notifications' ? 'rgba(74, 124, 89, 0.15)' : 'rgba(255, 255, 255, 0.9)',
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
                color: '#fff',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                fontSize: '9px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
