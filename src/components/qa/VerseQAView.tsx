import React, { useState, useEffect } from 'react';
import { Search, Plus, HelpCircle, MessageSquare } from 'lucide-react';
import { QuestionCard } from './QuestionCard.tsx';
import { AskQuestionModal } from './AskQuestionModal.tsx';
import { AnswersDrawer } from './AnswersDrawer.tsx';
import { BibleRealDB } from '../../services/storage.ts';
import type { VerseQuestion, UserProfile } from '../../types/index.ts';

interface VerseQAViewProps {
  currentUser: UserProfile;
}

export const VerseQAView: React.FC<VerseQAViewProps> = ({ currentUser }) => {
  const [questions, setQuestions] = useState<VerseQuestion[]>([]);
  const [search, setSearch] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<VerseQuestion | null>(null);
  const [isAnswersDrawerOpen, setIsAnswersDrawerOpen] = useState(false);

  const loadQuestions = () => {
    setQuestions(BibleRealDB.getQuestions());
  };

  useEffect(() => {
    loadQuestions();
    const unsub = BibleRealDB.subscribe(() => {
      loadQuestions();
      // If drawer is open, keep selected question fresh
      if (selectedQuestion) {
        const fresh = BibleRealDB.getQuestions().find((q) => q.id === selectedQuestion.id);
        if (fresh) setSelectedQuestion(fresh);
      }
    });
    return unsub;
  }, [selectedQuestion]);

  const handleToggleQuestionUpvote = (questionId: string) => {
    BibleRealDB.toggleQuestionUpvote(questionId, currentUser.id);
  };

  const handleOpenAnswers = (question: VerseQuestion) => {
    setSelectedQuestion(question);
    setIsAnswersDrawerOpen(true);
  };

  const handleAddAnswer = (questionId: string, text: string) => {
    BibleRealDB.addAnswer(questionId, {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      text
    });
  };

  const handleToggleAnswerUpvote = (questionId: string, answerId: string) => {
    BibleRealDB.toggleAnswerUpvote(questionId, answerId, currentUser.id);
  };

  const handleCreateQuestion = (newQ: Omit<VerseQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers'>) => {
    BibleRealDB.addQuestion(newQ);
  };

  const filtered = questions.filter((q) =>
    q.verseReference.toLowerCase().includes(search.toLowerCase()) ||
    q.questionText.toLowerCase().includes(search.toLowerCase()) ||
    q.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '16px 14px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Intro Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 246, 243, 0.95) 100%)',
          borderRadius: '24px',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 8px 24px rgba(74, 124, 89, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={16} color="var(--accent-gold)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Verse Study & Q&A
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Ask questions about challenging verses & discuss with the club.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="btn-primary"
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '9999px',
            flexShrink: 0
          }}
        >
          <Plus size={14} />
          <span>Ask Verse</span>
        </button>
      </div>

      {/* Search Input */}
      <div
        style={{
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
          placeholder="Search by verse (e.g. John 15, Romans 8)..."
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

      {/* Questions Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            currentUser={currentUser}
            onToggleUpvote={handleToggleQuestionUpvote}
            onOpenAnswers={handleOpenAnswers}
          />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <MessageSquare size={36} color="var(--accent-gold)" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>
              No questions found
            </h4>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Be the first to ask a question about any verse!
            </p>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="btn-primary"
              style={{ marginTop: '16px' }}
            >
              Ask First Question
            </button>
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        currentUser={currentUser}
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={handleCreateQuestion}
      />

      {/* Answers & Comments Drawer */}
      <AnswersDrawer
        question={selectedQuestion}
        currentUser={currentUser}
        isOpen={isAnswersDrawerOpen}
        onClose={() => setIsAnswersDrawerOpen(false)}
        onAddAnswer={handleAddAnswer}
        onToggleAnswerUpvote={handleToggleAnswerUpvote}
      />
    </div>
  );
};
