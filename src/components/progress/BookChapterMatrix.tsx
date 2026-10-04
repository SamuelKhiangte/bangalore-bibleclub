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
            padding: '8px 12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)'
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
              color: '#fff',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {(['ALL', 'NT', 'OT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === t ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === t ? '#000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
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
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: isComplete ? '1px solid var(--border-emerald)' : '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isComplete ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isComplete ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}
                >
                  {isComplete ? <CheckCircle2 size={16} /> : book.abbreviation.slice(0, 3)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                      {book.name}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      ({book.genre})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
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
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {readCount}/{book.chaptersCount} chs
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{pct}%</span>
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              backgroundColor: '#0F172A',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              border: '1px solid var(--border-subtle)',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F8FAFC' }}>
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
                      borderRadius: '12px',
                      border: isRead ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                      backgroundColor: isRead ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isRead ? '#A7F3D0' : '#F8FAFC',
                      fontWeight: 700,
                      fontSize: '14px',
                      fontFamily: 'var(--font-display)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isRead ? '0 0 10px rgba(16, 185, 129, 0.25)' : 'none',
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
