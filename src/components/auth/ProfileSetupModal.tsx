import React, { useState } from 'react';
import { User, Check, ArrowRight } from 'lucide-react';
import type { UserProfile } from '../../types/index.ts';

interface ProfileSetupModalProps {
  phoneNumber: string;
  onComplete: (user: UserProfile) => void;
}

const PRESET_AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Grace' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Caleb' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', label: 'Hannah' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: 'Joshua' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', label: 'Esther' }
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  phoneNumber,
  onComplete
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalUsername = username.trim()
      ? username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
      : name.trim().toLowerCase().replace(/\s+/g, '_');

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      phoneNumber,
      name: name.trim(),
      username: finalUsername,
      avatarUrl: selectedAvatar,
      streakDays: 1,
      lastReadDate: null,
      joinedAt: new Date().toISOString()
    };

    onComplete(newUser);
  };

  return (
    <div
      style={{
        padding: '28px 20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        justifyContent: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--accent-gold)'
          }}
        >
          <User size={32} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
          Create Profile
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          How should friends see you in the Bible reading circle?
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Choose an Avatar
          </label>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {PRESET_AVATARS.map((av) => {
              const isSelected = selectedAvatar === av.url;
              return (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.url)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    padding: '2px',
                    border: isSelected ? '2px solid var(--accent-gold)' : '2px solid transparent',
                    boxShadow: isSelected ? '0 0 12px var(--accent-gold-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        backgroundColor: 'var(--accent-gold)',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000'
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Samuel Khiangte"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              @
            </span>
            <input
              type="text"
              placeholder="samuelk"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 32px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '14px', marginTop: '10px' }}
        >
          <span>Join Bible Reading Circle</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};
