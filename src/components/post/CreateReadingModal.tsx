import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { DualCameraCapture } from '../camera/DualCameraCapture.tsx';
import { BeRealCardPreview } from '../camera/BeRealCardPreview.tsx';
import { PassageSelector, type PassageSelection } from './PassageSelector.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import { playNotificationChime } from '../../services/sound.ts';
import type { UserProfile, ReadingPost } from '../../types/index.ts';

interface CreateReadingModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: ReadingPost) => void;
}

export const CreateReadingModal: React.FC<CreateReadingModalProps> = ({
  user,
  isOpen,
  onClose,
  onPostCreated
}) => {
  // Phase: 'camera' | 'details'
  const [phase, setPhase] = useState<'camera' | 'details'>('camera');
  const [startPhoto, setStartPhoto] = useState<string | null>(null);
  const [endPhoto, setEndPhoto] = useState<string | null>(null);

  const [passage, setPassage] = useState<PassageSelection>({
    bookId: 'romans',
    bookName: 'Romans',
    startChapter: 8,
    startVerse: 1,
    endChapter: 8,
    endVerse: 39,
    chaptersCount: 1,
    durationMinutes: 16
  });

  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhotosCaptured = (start: string, end: string) => {
    setStartPhoto(start);
    setEndPhoto(end);
    setPhase('details');
  };

  const handlePublish = () => {
    if (!startPhoto || !endPhoto) return;
    setIsSubmitting(true);

    const newPost: ReadingPost = {
      id: `post-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      startPhotoUrl: startPhoto,
      endPhotoUrl: endPhoto,
      bookId: passage.bookId,
      bookName: passage.bookName,
      startChapter: passage.startChapter,
      startVerse: passage.startVerse,
      endChapter: passage.endChapter,
      endVerse: passage.endVerse,
      chaptersCount: passage.chaptersCount,
      durationMinutes: passage.durationMinutes,
      reflection: reflection.trim() || undefined,
      createdAt: new Date().toISOString(),
      reactions: {
        '🙏': [user.id] // user amens their own reading habit
      },
      comments: []
    };

    // 1. Add post to storage
    BibleRealDB.addPost(newPost);

    // 2. Record chapters read in Bible progress tracker & update streak
    BibleRealDB.recordChaptersRead(passage.bookId, passage.startChapter, passage.endChapter);

    // 3. Dispatch group notification to friends circle
    const verseRef = `${passage.bookName} ${passage.startChapter}:${passage.startVerse}–${
      passage.startChapter === passage.endChapter ? '' : `${passage.endChapter}:`
    }${passage.endVerse}`;

    BibleRealDB.addNotification({
      type: 'reading_completed',
      actorName: user.name,
      actorAvatar: user.avatarUrl,
      title: 'Reading Completed',
      message: `${user.name} completed ${verseRef} (${passage.chaptersCount} ch)`,
      postId: newPost.id
    });

    // 4. Play chime & trigger celebration confetti
    playNotificationChime();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#FCD34D']
      });
    } catch {
      // Ignored if canvas-confetti unsupported
    }

    setIsSubmitting(false);
    onPostCreated(newPost);
    onClose();

    // Reset phase
    setPhase('camera');
    setStartPhoto(null);
    setEndPhoto(null);
    setReflection('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'var(--bg-app)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {phase === 'camera' ? (
        <DualCameraCapture
          onPhotosCaptured={handlePhotosCaptured}
          onCancel={onClose}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(16, 23, 38, 0.8)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <button
              onClick={() => setPhase('camera')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#F8FAFC' }}>
              Reading Details
            </span>

            <div style={{ width: '40px' }} />
          </div>

          {/* Form Scroll Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* BeReal Tap-to-Swap Dual Preview Thumbnail */}
            {startPhoto && endPhoto && (
              <div style={{ width: '220px', margin: '0 auto 20px' }}>
                <BeRealCardPreview
                  startPhoto={startPhoto}
                  endPhoto={endPhoto}
                  isInteractive={true}
                  aspectRatio="4 / 5"
                />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Tap preview thumbnail to toggle views
                </p>
              </div>
            )}

            {/* Passage Selection Engine */}
            <PassageSelector value={passage} onChange={setPassage} />

            {/* Reflection Note */}
            <div style={{ marginTop: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <MessageSquare size={14} color="var(--accent-emerald)" />
                <span>Reflection / What spoke to you?</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Share a key takeaway or verse that touched your heart today..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(16, 23, 38, 0.95)'
            }}
          >
            <button
              className="btn-primary"
              disabled={isSubmitting}
              onClick={handlePublish}
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              <Send size={18} />
              <span>Post to Friends Circle & Notify Group</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
