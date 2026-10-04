import React from 'react';
import { Book, Clock } from 'lucide-react';
import { BIBLE_BOOKS, getBookById } from '../../data/bibleCanon.ts';

export interface PassageSelection {
  bookId: string;
  bookName: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  chaptersCount: number;
  durationMinutes: number;
}

interface PassageSelectorProps {
  value: PassageSelection;
  onChange: (val: PassageSelection) => void;
}

export const PassageSelector: React.FC<PassageSelectorProps> = ({ value, onChange }) => {
  const currentBook = getBookById(value.bookId) || BIBLE_BOOKS[0];

  const handleBookChange = (bookId: string) => {
    const book = getBookById(bookId);
    if (!book) return;
    onChange({
      ...value,
      bookId: book.id,
      bookName: book.name,
      startChapter: 1,
      startVerse: 1,
      endChapter: 1,
      endVerse: 10,
      chaptersCount: 1
    });
  };

  const handleStartChapterChange = (ch: number) => {
    const validCh = Math.max(1, Math.min(ch, currentBook.chaptersCount));
    const nextEnd = Math.max(validCh, value.endChapter);
    const count = nextEnd - validCh + 1;
    onChange({
      ...value,
      startChapter: validCh,
      endChapter: nextEnd,
      chaptersCount: count
    });
  };

  const handleEndChapterChange = (ch: number) => {
    const validCh = Math.max(value.startChapter, Math.min(ch, currentBook.chaptersCount));
    const count = validCh - value.startChapter + 1;
    onChange({
      ...value,
      endChapter: validCh,
      chaptersCount: count
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Book Picker */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <Book size={14} color="var(--accent-gold)" />
          <span>Bible Book</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
            {currentBook.testament === 'OT' ? 'Old Testament' : 'New Testament'} • {currentBook.chaptersCount} Chs
          </span>
        </label>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={value.bookId}
            onChange={(e) => handleBookChange(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-accent)',
              color: '#F8FAFC',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <optgroup label="New Testament" style={{ background: '#0F172A' }}>
              {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.chaptersCount} chs)
                </option>
              ))}
            </optgroup>
            <optgroup label="Old Testament" style={{ background: '#0F172A' }}>
              {BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.chaptersCount} chs)
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Chapter & Verse Grid */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}
      >
        {/* Starting Range */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            START VERSE
          </span>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Chapter</span>
              <input
                type="number"
                min={1}
                max={currentBook.chaptersCount}
                value={value.startChapter}
                onChange={(e) => handleStartChapterChange(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Verse</span>
              <input
                type="number"
                min={1}
                value={value.startVerse}
                onChange={(e) => onChange({ ...value, startVerse: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
        </div>

        {/* Ending Range */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            END VERSE
          </span>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Chapter</span>
              <input
                type="number"
                min={value.startChapter}
                max={currentBook.chaptersCount}
                value={value.endChapter}
                onChange={(e) => handleEndChapterChange(parseInt(e.target.value) || value.startChapter)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Verse</span>
              <input
                type="number"
                min={1}
                value={value.endVerse}
                onChange={(e) => onChange({ ...value, endVerse: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reading Duration & Summary Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Clock size={14} color="var(--accent-blue)" />
          <span>Reading Time:</span>
          <input
            type="number"
            min={1}
            max={180}
            value={value.durationMinutes}
            onChange={(e) => onChange({ ...value, durationMinutes: parseInt(e.target.value) || 15 })}
            style={{
              width: '48px',
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center'
            }}
          />
          <span>mins</span>
        </div>

        <div
          className="glass-pill"
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold)'
          }}
        >
          {value.chaptersCount} {value.chaptersCount === 1 ? 'Chapter' : 'Chapters'} Logged
        </div>
      </div>
    </div>
  );
};
