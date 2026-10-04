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
        backgroundColor: 'rgba(8, 12, 21, 0.95)',
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
          gap: '4px',
          color: activeTab === 'feed' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px'
        }}
      >
        <Home size={20} />
        <span style={{ fontSize: '10px', fontWeight: activeTab === 'feed' ? 700 : 500 }}>Circle</span>
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
          gap: '4px',
          color: activeTab === 'progress' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px'
        }}
      >
        <BarChart2 size={20} />
        <span style={{ fontSize: '10px', fontWeight: activeTab === 'progress' ? 700 : 500 }}>Tracker</span>
      </button>

      {/* Primary Center Capture Button */}
      <button
        onClick={onOpenCapture}
        style={{
          position: 'relative',
          top: '-12px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
          border: '3px solid #080C15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#080C15',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
          cursor: 'pointer',
          transform: 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        title="Snap Bible Reading (BeReal 2 photos)"
      >
        <Camera size={24} strokeWidth={2.5} />
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
          gap: '4px',
          color: activeTab === 'notifications' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px'
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
        <span style={{ fontSize: '10px', fontWeight: activeTab === 'notifications' ? 700 : 500 }}>Alerts</span>
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
          gap: '4px',
          color: activeTab === 'profile' ? 'var(--accent-gold)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px'
        }}
      >
        <User size={20} />
        <span style={{ fontSize: '10px', fontWeight: activeTab === 'profile' ? 700 : 500 }}>Profile</span>
      </button>
    </nav>
  );
};
