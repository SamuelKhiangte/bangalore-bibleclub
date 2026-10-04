import React from 'react';
import { BookOpen, ThumbsUp, MessageCircle, CheckCircle } from 'lucide-react';
import type { VerseQuestion, UserProfile } from '../../types/index.ts';

interface QuestionCardProps {
  question: VerseQuestion;
  currentUser: UserProfile;
  onToggleUpvote: (questionId: string) => void;
  onOpenAnswers: (question: VerseQuestion) => void;
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

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentUser,
  onToggleUpvote,
  onOpenAnswers
}) => {
  const hasUpvoted = question.upvotes.includes(currentUser.id);
  const bestAnswer = question.answers.find((a) => a.isBestAnswer) || question.answers[0];

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '24px',
        padding: '18px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 4px 16px rgba(60, 45, 30, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header: Author + Verse Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={question.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={question.userName}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {question.userName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {timeAgo(question.createdAt)}
            </div>
          </div>
        </div>

        {/* Bible Verse Reference Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(194, 94, 48, 0.1)',
            border: '1px solid var(--border-accent)',
            borderRadius: '9999px',
            padding: '4px 10px',
            color: 'var(--accent-gold)',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)'
          }}
        >
          <BookOpen size={12} />
          <span>{question.verseReference}</span>
        </div>
      </div>

      {/* Question Text */}
      <div
        onClick={() => onOpenAnswers(question)}
        style={{ cursor: 'pointer' }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            fontFamily: 'var(--font-display)'
          }}
        >
          {question.questionText}
        </h3>
        {question.contextNote && (
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
            "{question.contextNote}"
          </p>
        )}
      </div>

      {/* Top Answer Preview Highlight (if answers exist) */}
      {bestAnswer && (
        <div
          onClick={() => onOpenAnswers(question)}
          style={{
            padding: '12px 14px',
            borderRadius: '16px',
            backgroundColor: '#F9F7F1',
            borderLeft: '3px solid var(--accent-emerald)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {bestAnswer.userName}
            </span>
            {bestAnswer.isBestAnswer && (
              <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <CheckCircle size={11} /> Top Answer
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {bestAnswer.text}
          </p>
        </div>
      )}

      {/* Footer Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '10px',
          marginTop: '2px'
        }}
      >
        <button
          onClick={() => onToggleUpvote(question.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: hasUpvoted ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            backgroundColor: hasUpvoted ? 'rgba(194, 94, 48, 0.12)' : 'transparent',
            color: hasUpvoted ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)'
          }}
        >
          <ThumbsUp size={13} fill={hasUpvoted ? 'var(--accent-gold)' : 'none'} />
          <span>{question.upvotes.length > 0 ? question.upvotes.length : ''} Curious</span>
        </button>

        <button
          onClick={() => onOpenAnswers(question)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)'
          }}
        >
          <MessageCircle size={15} />
          <span>{question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}</span>
        </button>
      </div>
    </div>
  );
};
