import { describe, it, expect, beforeEach } from 'vitest';
import { BibleRealDB } from '../src/services/storage.ts';

describe('Verse Q&A and Discussions Storage & Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes questions storage cleanly and creates a question', async () => {
    const questions = BibleRealDB.getQuestions();
    expect(questions.length).toBe(0);

    const newQ = await BibleRealDB.addQuestion({
      userId: 'user-me',
      userName: 'Samuel Khiangte',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      verseReference: 'Romans 8:28',
      bookId: 'romans',
      questionText: 'How do all things work together for good during difficult trials?',
      contextNote: 'Reflecting on chapter 8'
    });

    expect(newQ.id).toBeDefined();
    expect(newQ.verseReference).toBe('Romans 8:28');
    expect(newQ.answers).toEqual([]);

    const allQuestions = BibleRealDB.getQuestions();
    expect(allQuestions[0].id).toBe(newQ.id); // newest first
  });

  it('allows answering a question and toggling upvotes', async () => {
    const targetQ = await BibleRealDB.addQuestion({
      userId: 'user-me',
      userName: 'Samuel Khiangte',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      verseReference: 'John 15:5',
      bookId: 'john',
      questionText: 'What does abiding in the Vine look like in daily busy life?'
    });

    // Add answer
    await BibleRealDB.addAnswer(targetQ.id, {
      userId: 'user-me',
      userName: 'Samuel Khiangte',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: 'Great reflection! God provides the peace that transcends all understanding.'
    });

    let updatedQ = BibleRealDB.getQuestions().find((q) => q.id === targetQ.id);
    expect(updatedQ).toBeDefined();
    expect(updatedQ?.answers.some((a) => a.text.includes('peace that transcends'))).toBe(true);

    // Toggle upvote on question
    await BibleRealDB.toggleQuestionUpvote(targetQ.id, 'user-me');
    updatedQ = BibleRealDB.getQuestions().find((q) => q.id === targetQ.id);
    expect(updatedQ?.upvotes).toContain('user-me');

    // Untoggle upvote
    await BibleRealDB.toggleQuestionUpvote(targetQ.id, 'user-me');
    updatedQ = BibleRealDB.getQuestions().find((q) => q.id === targetQ.id);
    expect(updatedQ?.upvotes).not.toContain('user-me');
  });
});
