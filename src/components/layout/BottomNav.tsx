import React from 'react';
import { Home, BarChart2, Camera, Bell, User } from 'lucide-react';
import type { ActiveTab } from '../../types/index.ts';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCapture: () => void;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenCapture,
  unreadCount
}) => {
  return (
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'rgba(247, 244, 236, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px 10px',
        zIndex: 50
      }}
    >
      {/* Feed Tab */}
      <button
        onClick={() => onTabChange('feed')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'feed' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          fontFamily: 'var(--font-display)'
        }}
      >
        <Home size={20} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'feed' ? 800 : 600 }}>Circle</span>
      </button>

      {/* Progress Tab */}
      <button
        onClick={() => onTabChange('progress')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'progress' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          fontFamily: 'var(--font-display)'
        }}
      >
        <BarChart2 size={20} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'progress' ? 800 : 600 }}>Tracker</span>
      </button>

      {/* Primary Center Capture Button - Warm Terracotta */}
      <button
        onClick={onOpenCapture}
        style={{
          position: 'relative',
          top: '-12px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C25E30 0%, #A84920 100%)',
          border: '3px solid #F7F4EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(194, 94, 48, 0.35)',
          cursor: 'pointer',
          transform: 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        title="Snap Bible Reading (2 photos)"
      >
        <Camera size={24} strokeWidth={2.4} />
      </button>

      {/* Notifications Tab */}
      <button
        onClick={() => onTabChange('notifications')}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'notifications' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          fontFamily: 'var(--font-display)'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '8px',
              backgroundColor: 'var(--accent-gold)',
              borderRadius: '50%',
              width: '8px',
              height: '8px'
            }}
          />
        )}
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'notifications' ? 800 : 600 }}>Alerts</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => onTabChange('profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'profile' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          fontFamily: 'var(--font-display)'
        }}
      >
        <User size={20} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? 800 : 600 }}>Profile</span>
      </button>
    </nav>
  );
};
