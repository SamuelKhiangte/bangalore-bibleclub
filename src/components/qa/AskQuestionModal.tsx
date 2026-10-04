import React, { useState } from 'react';
import { X, HelpCircle, Send } from 'lucide-react';
import { BIBLE_BOOKS, getBookById } from '../../data/bibleCanon.ts';
import type { UserProfile, VerseQuestion } from '../../types/index.ts';

interface AskQuestionModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (q: Omit<VerseQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers'>) => void;
  initialBookId?: string;
  initialVerseRef?: string;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSubmit,
  initialBookId = 'john',
  initialVerseRef
}) => {
  const [bookId, setBookId] = useState(initialBookId);
  const [chapter, setChapter] = useState(15);
  const [verse, setVerse] = useState(5);
  const [questionText, setQuestionText] = useState('');
  const [contextNote, setContextNote] = useState('');

  if (!isOpen) return null;

  const currentBook = getBookById(bookId) || BIBLE_BOOKS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const ref = initialVerseRef || `${currentBook.name} ${chapter}:${verse}`;

    onSubmit({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      verseReference: ref,
      bookId: currentBook.id,
      questionText: questionText.trim(),
      contextNote: contextNote.trim() || undefined
    });

    setQuestionText('');
    setContextNote('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(40, 32, 26, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FAF7F0',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          border: '1px solid var(--border-subtle)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -10px 40px rgba(60, 45, 30, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(74, 124, 89, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}
            >
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Ask a Verse Question
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Ask Bangalore BibleClub members for insights & commentary
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {/* Scripture Passage Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Bible Verse Reference
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                style={{
                  flex: 2,
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                <input
                  type="number"
                  min={1}
                  max={currentBook.chaptersCount}
                  value={chapter}
                  onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
                  placeholder="Ch"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
                <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>:</span>
                <input
                  type="number"
                  min={1}
                  value={verse}
                  onChange={(e) => setVerse(parseInt(e.target.value) || 1)}
                  placeholder="V"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Your Question
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. What is the historical context of this verse? How does this promise apply when we face discouragement?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.45,
                outline: 'none',
                fontFamily: 'var(--font-main)'
              }}
            />
          </div>

          {/* Context / Additional Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Additional Context / Thoughts <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Any background or what led you to think about this verse..."
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                lineHeight: 1.4,
                outline: 'none',
                fontFamily: 'var(--font-main)'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '6px' }}
          >
            <Send size={16} />
            <span>Post Question to Circle</span>
          </button>
        </form>
      </div>
    </div>
  );
};
