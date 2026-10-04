import { Phone, Flame, BookOpen, Users, LogOut } from 'lucide-react';
import { BibleRealDB } from '../../services/storage.ts';
import { calculateBibleProgress } from '../../services/bibleTracker.ts';
import type { UserProfile } from '../../types/index.ts';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const completedChapters = BibleRealDB.getCompletedChapters();
  const stats = calculateBibleProgress(completedChapters);

  return (
    <div style={{ padding: '20px 16px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 20px',
          textAlign: 'center',
          borderRadius: '24px',
          border: '1px solid var(--border-accent)',
          background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(16, 23, 38, 0.8) 80%)'
        }}
      >
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
              boxShadow: '0 0 20px var(--accent-gold-glow)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#10B981',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              border: '3px solid #080C15'
            }}
          />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#F8FAFC' }}>
          {user.name}
        </h2>
        <span style={{ fontSize: '14px', color: 'var(--accent-gold)', fontWeight: 600 }}>
          @{user.username}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Phone size={12} />
          <span>{user.phoneNumber}</span>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-panel" style={{ padding: '14px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
            <Flame size={20} fill="var(--accent-gold)" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{user.streakDays} Days</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Streak</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <BookOpen size={18} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{stats.totalChaptersRead} Chs</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bible Completed</div>
          </div>
        </div>
      </div>

      {/* Group Circle Info */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
              Your Reading Circle
            </span>
          </div>
          <span className="glass-pill" style={{ padding: '3px 8px', fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
            Active Group
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          You share reading alerts with <strong>Sarah Jenkins, David Miller, and Michael Chang</strong>. Whenever you post your start and end photos, an alert is sent to everyone in this group.
        </p>
      </div>

      {/* Log Out Button */}
      <button
        onClick={onLogout}
        className="btn-secondary"
        style={{
          width: '100%',
          padding: '14px',
          color: 'var(--accent-rose)',
          borderColor: 'rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '10px'
        }}
      >
        <LogOut size={16} />
        <span>Log Out of Account</span>
      </button>
    </div>
  );
};
