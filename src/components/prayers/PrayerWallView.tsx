import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, CheckCircle2, Trash2, EyeOff, ShieldCheck, MessageCircleHeart } from 'lucide-react';
import { BotanicalArt } from '../common/BotanicalArt.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import type { PrayerRequest, UserProfile } from '../../types/index.ts';

interface PrayerWallViewProps {
  currentUser: UserProfile;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const PrayerWallView: React.FC<PrayerWallViewProps> = ({ currentUser }) => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [filter, setFilter] = useState<'active' | 'answered'>('active');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const loadPrayers = () => {
    setPrayers(BibleRealDB.getPrayerRequests());
  };

  useEffect(() => {
    loadPrayers();
    const unsub = BibleRealDB.subscribe(() => {
      loadPrayers();
    });
    return unsub;
  }, []);

  const handleSubmitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    BibleRealDB.addPrayerRequest({
      userId: currentUser.id,
      userName: isAnonymous ? 'Anonymous Circle Member' : currentUser.name,
      userAvatar: isAnonymous ? '' : currentUser.avatarUrl,
      isAnonymous,
      title: title.trim(),
      description: description.trim(),
      isAnswered: false
    });

    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setIsCreateOpen(false);
  };

  const handleTogglePraying = (prayerId: string) => {
    BibleRealDB.togglePraying(prayerId, currentUser.id);
  };

  const handleToggleAnswered = (prayerId: string) => {
    BibleRealDB.togglePrayerAnswered(prayerId);
  };

  const handleDelete = (prayerId: string) => {
    if (confirm('Delete this prayer request?')) {
      BibleRealDB.deletePrayerRequest(prayerId, currentUser.id);
    }
  };

  const filteredPrayers = prayers.filter((p) => {
    if (filter === 'answered') return p.isAnswered;
    return !p.isAnswered;
  });

  return (
    <div style={{ padding: '16px 16px 40px', maxWidth: '520px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          position: 'relative',
          padding: '22px 18px',
          marginBottom: '20px',
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
            right: '8px',
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
            Circle Fellowship
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
            prayer points
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
            "Carry each other's burdens, and in this way you will fulfill the law of Christ." — Galatians 6:2
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary"
          style={{
            marginTop: '16px',
            borderRadius: '9999px',
            padding: '10px 18px',
            fontSize: '13px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Share Prayer Point</span>
        </button>
      </div>

      {/* Filter Tabs (Active vs Answered) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '18px',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: filter === 'active' ? 'var(--accent-gold)' : 'var(--border-subtle)',
            backgroundColor: filter === 'active' ? 'var(--accent-gold)' : '#FFFFFF',
            color: filter === 'active' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s ease'
          }}
        >
          Active Requests ({prayers.filter((p) => !p.isAnswered).length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: filter === 'answered' ? 'var(--accent-gold)' : 'var(--border-subtle)',
            backgroundColor: filter === 'answered' ? 'var(--accent-gold)' : '#FFFFFF',
            color: filter === 'answered' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s ease'
          }}
        >
          Praise Reports ({prayers.filter((p) => p.isAnswered).length})
        </button>
      </div>

      {/* Prayers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPrayers.map((prayer) => {
          const isUserPraying = prayer.prayingUserIds.includes(currentUser.id);
          const isAuthor = prayer.userId === currentUser.id;

          return (
            <div
              key={prayer.id}
              className="glass-panel"
              style={{
                padding: '18px 20px',
                borderRadius: '22px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 18px rgba(35, 60, 42, 0.05)'
              }}
            >
              {/* Card Header with Author & Time */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {prayer.isAnonymous ? (
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#FAF7F2',
                        border: '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)'
                      }}
                      title="Anonymous Member"
                    >
                      <EyeOff size={18} />
                    </div>
                  ) : (
                    <img
                      src={prayer.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                      alt={prayer.userName}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid var(--border-accent)'
                      }}
                    />
                  )}

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
                        {prayer.isAnonymous ? 'Anonymous Member' : prayer.userName}
                      </span>
                      {prayer.isAnonymous && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            backgroundColor: '#FAF7F2',
                            color: 'var(--accent-gold)',
                            fontWeight: 600
                          }}
                        >
                          Private
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {timeAgo(prayer.createdAt)}
                    </span>
                  </div>
                </div>

                {prayer.isAnswered && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(74, 124, 89, 0.12)',
                      color: 'var(--accent-gold)',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>Answered 🙌</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  lineHeight: 1.25
                }}
              >
                {prayer.title}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: '1.55',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '16px'
                }}
              >
                {prayer.description}
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px'
                }}
              >
                {/* Praying Button */}
                <button
                  onClick={() => handleTogglePraying(prayer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isUserPraying ? 'var(--accent-gold)' : 'var(--border-subtle)',
                    backgroundColor: isUserPraying ? 'rgba(74, 124, 89, 0.12)' : '#FFFFFF',
                    color: isUserPraying ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '15px' }}>🙏</span>
                  <span>{isUserPraying ? 'Praying with you' : 'Pray for this'}</span>
                  <span
                    style={{
                      backgroundColor: isUserPraying ? 'var(--accent-gold)' : '#EDEBE4',
                      color: isUserPraying ? '#FFFFFF' : 'var(--text-primary)',
                      borderRadius: '9999px',
                      padding: '1px 6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginLeft: '2px'
                    }}
                  >
                    {prayer.prayingUserIds.length}
                  </span>
                </button>

                {/* Author Controls */}
                {isAuthor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleAnswered(prayer.id)}
                      title={prayer.isAnswered ? 'Mark as active' : 'Mark as answered praise report'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-gold)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={13} />
                      <span>{prayer.isAnswered ? 'Re-open' : 'Praise!'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      title="Delete request"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredPrayers.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#FAF7F2',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <BotanicalArt width={65} height={95} color="var(--accent-gold)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}
            >
              {filter === 'answered' ? 'no praise reports yet' : 'peace be with your circle'}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
                maxWidth: '280px',
                margin: '6px auto 0'
              }}
            >
              {filter === 'answered'
                ? 'Answered prayers will appear here as testimonies.'
                : 'Share a prayer request or health need with your brothers and sisters.'}
            </p>
            {filter === 'active' && (
              <button
                className="btn-primary"
                onClick={() => setIsCreateOpen(true)}
                style={{ marginTop: '18px', padding: '9px 18px', borderRadius: '9999px', fontSize: '13px' }}
              >
                Share First Prayer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Share Prayer Request Modal */}
      {isCreateOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(28, 41, 32, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div
            className="glass-panel"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px 22px',
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-accent)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircleHeart size={20} color="var(--accent-gold)" />
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    color: 'var(--text-primary)'
                  }}
                >
                  share prayer point
                </h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPrayer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Prayer Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healing for family, Guidance in job transition..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-main)',
                    outline: 'none',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Details & Scripture Request
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details of the need so your circle can pray in agreement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-main)',
                    outline: 'none',
                    backgroundColor: '#FAF7F2',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Optional Anonymity Toggle */}
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: isAnonymous ? '#FAF7F2' : '#F5F5F0',
                  border: isAnonymous ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <EyeOff size={18} color={isAnonymous ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Post Anonymously
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Hide your name and profile picture from circle members
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '1.5px solid var(--accent-gold)',
                    backgroundColor: isAnonymous ? 'var(--accent-gold)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  {isAnonymous && <CheckCircle2 size={14} />}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <ShieldCheck size={14} color="var(--accent-gold)" />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  A safe, confidential circle space for Bangalore BibleClub.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, borderRadius: '9999px', padding: '11px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, borderRadius: '9999px', padding: '11px' }}
                >
                  Post to Prayer Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
