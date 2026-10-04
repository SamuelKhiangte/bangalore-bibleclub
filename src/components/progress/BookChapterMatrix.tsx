import React, { useState } from 'react';
import { Search, CheckCircle2, ChevronRight, X, BookOpen } from 'lucide-react';
import { BIBLE_BOOKS, type BibleBook } from '../../data/bibleCanon.ts';

interface BookChapterMatrixProps {
  completedChapters: Record<string, number[]>;
  onToggleChapter: (bookId: string, chapter: number) => void;
}

export const BookChapterMatrix: React.FC<BookChapterMatrixProps> = ({
  completedChapters,
  onToggleChapter
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);

  const filtered = BIBLE_BOOKS.filter((b) => {
    const matchesTab = activeTab === 'ALL' || b.testament === activeTab;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Search & Testament Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 6px rgba(60, 45, 30, 0.04)'
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search all 66 books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '100%',
              fontFamily: 'var(--font-main)',
              fontWeight: 600
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {(['ALL', 'NT', 'OT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === t ? 'var(--accent-gold)' : '#FFFFFF',
                color: activeTab === t ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 2px 6px rgba(60, 45, 30, 0.04)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Books List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
        {filtered.map((book) => {
          const readList = completedChapters[book.id.toLowerCase()] || [];
          const readCount = readList.length;
          const pct = Math.round((readCount / book.chaptersCount) * 100);
          const isComplete = readCount >= book.chaptersCount;

          return (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="glass-panel"
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: isComplete ? '1px solid var(--border-emerald)' : '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: isComplete ? 'rgba(67, 122, 92, 0.15)' : 'rgba(194, 94, 48, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isComplete ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                    fontWeight: 800,
                    fontSize: '12px',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  {isComplete ? <CheckCircle2 size={18} /> : book.abbreviation.slice(0, 3)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {book.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ({book.genre})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '5px',
                        backgroundColor: '#EDE8DE',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: isComplete ? 'var(--accent-emerald)' : 'var(--accent-gold)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {readCount}/{book.chaptersCount} chs
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{pct}%</span>
                <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapters Interactive Drawer */}
      {selectedBook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(40, 32, 26, 0.65)',
            backdropFilter: 'blur(10px)',
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedBook(null)}
        >
          <div
            style={{
              backgroundColor: '#FAF7F0',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              border: '1px solid var(--border-subtle)',
              maxHeight: '80vh',
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {selectedBook.name}
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Tap chapter to mark read/unread • {selectedBook.chaptersCount} Chapters Total
                </span>
              </div>

              <button
                onClick={() => setSelectedBook(null)}
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

            {/* Chapters Grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))',
                gap: '10px'
              }}
            >
              {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((ch) => {
                const readList = completedChapters[selectedBook.id.toLowerCase()] || [];
                const isRead = readList.includes(ch);

                return (
                  <button
                    key={ch}
                    onClick={() => onToggleChapter(selectedBook.id, ch)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '14px',
                      border: isRead ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                      backgroundColor: isRead ? 'rgba(67, 122, 92, 0.18)' : '#FFFFFF',
                      color: isRead ? 'var(--accent-emerald)' : 'var(--text-primary)',
                      fontWeight: 800,
                      fontSize: '14px',
                      fontFamily: 'var(--font-display)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isRead ? '0 0 10px rgba(67, 122, 92, 0.2)' : '0 2px 6px rgba(60, 45, 30, 0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{ch}</span>
                    {isRead && <span style={{ fontSize: '9px', lineHeight: 1 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
