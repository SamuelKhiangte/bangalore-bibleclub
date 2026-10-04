import React, { useState } from 'react';
import { X, Send, ThumbsUp, BookOpen, CheckCircle } from 'lucide-react';
import type { VerseQuestion, UserProfile } from '../../types/index.ts';

interface AnswersDrawerProps {
  question: VerseQuestion | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddAnswer: (questionId: string, text: string) => void;
  onToggleAnswerUpvote: (questionId: string, answerId: string) => void;
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

export const AnswersDrawer: React.FC<AnswersDrawerProps> = ({
  question,
  currentUser,
  isOpen,
  onClose,
  onAddAnswer,
  onToggleAnswerUpvote
}) => {
  const [answerText, setAnswerText] = useState('');

  if (!isOpen || !question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onAddAnswer(question.id, answerText.trim());
    setAnswerText('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(40, 32, 26, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 450,
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
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(194, 94, 48, 0.1)',
                padding: '4px 10px',
                borderRadius: '9999px',
                color: 'var(--accent-gold)',
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: 'var(--font-display)'
              }}
            >
              <BookOpen size={12} />
              <span>{question.verseReference}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Discussions
            </span>
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

        {/* Scroll Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Question Summary Banner */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(60, 45, 30, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <img
                src={question.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={question.userName}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {question.userName} asks:
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, fontFamily: 'var(--font-display)' }}>
              {question.questionText}
            </h3>
            {question.contextNote && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                "{question.contextNote}"
              </p>
            )}
          </div>

          {/* Answers Count & List */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>
              {question.answers.length} {question.answers.length === 1 ? 'Answer & Commentary' : 'Answers & Commentaries'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {question.answers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No answers yet. Share your understanding or commentary on {question.verseReference}!
                </div>
              ) : (
                question.answers.map((ans) => {
                  const hasUpvoted = ans.upvotes?.includes(currentUser.id);
                  return (
                    <div
                      key={ans.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        padding: '14px 16px',
                        border: ans.isBestAnswer ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        boxShadow: '0 2px 8px rgba(60, 45, 30, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={ans.userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                            alt={ans.userName}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {ans.userName}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {timeAgo(ans.createdAt)}
                            </div>
                          </div>
                        </div>

                        {ans.isBestAnswer && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: 'var(--accent-emerald)',
                              backgroundColor: 'rgba(67, 122, 92, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <CheckCircle size={10} /> Top Answer
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0' }}>
                        {ans.text}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onToggleAnswerUpvote(question.id, ans.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            border: hasUpvoted ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                            backgroundColor: hasUpvoted ? 'rgba(194, 94, 48, 0.1)' : 'transparent',
                            color: hasUpvoted ? 'var(--accent-gold)' : 'var(--text-muted)',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <ThumbsUp size={11} fill={hasUpvoted ? 'var(--accent-gold)' : 'none'} />
                          <span>{ans.upvotes?.length || 0} Helpful</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <input
            type="text"
            placeholder="Write your answer or thoughts on this verse..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '9999px',
              backgroundColor: '#FAF7F0',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'var(--font-main)'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '9999px',
              fontSize: '13px'
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
