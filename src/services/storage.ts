import type { UserProfile, ReadingPost, GroupNotification, VerseQuestion, QuestionAnswer } from '../types/index.ts';
import {
  SAMPLE_START_PHOTO,
  SAMPLE_END_PHOTO,
  SAMPLE_JOHN_START,
  SAMPLE_JOHN_END
} from '../data/sampleBiblePhotos.ts';

const USER_KEY = 'bangalore_bibleclub_user';
const PROGRESS_KEY = 'bangalore_bibleclub_completed_chapters';
const POSTS_KEY = 'bangalore_bibleclub_posts';
const NOTIFICATIONS_KEY = 'bangalore_bibleclub_notifications';
const QUESTIONS_KEY = 'bangalore_bibleclub_questions';

export const DEFAULT_FRIEND_POSTS: ReadingPost[] = [
  {
    id: 'post-sarah-1',
    userId: 'user-sarah',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    startPhotoUrl: SAMPLE_START_PHOTO,
    endPhotoUrl: SAMPLE_END_PHOTO,
    bookId: 'hebrews',
    bookName: 'Hebrews',
    startChapter: 11,
    startVerse: 1,
    endChapter: 11,
    endVerse: 40,
    chaptersCount: 1,
    durationMinutes: 14,
    reflection: 'The Hall of Faith reminder this morning was so uplifting. Faith sees beyond what is visible.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    reactions: {
      '🙏': ['user-david', 'user-sarah'],
      '❤️': ['user-david'],
      '🔥': ['user-michael']
    },
    comments: [
      {
        id: 'c-1',
        userId: 'user-david',
        userName: 'David Miller',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Amen sister! Verse 1 has carried me through so much.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      }
    ]
  },
  {
    id: 'post-david-1',
    userId: 'user-david',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    startPhotoUrl: SAMPLE_JOHN_START,
    endPhotoUrl: SAMPLE_JOHN_END,
    bookId: 'john',
    bookName: 'John',
    startChapter: 1,
    startVerse: 1,
    endChapter: 1,
    endVerse: 18,
    chaptersCount: 1,
    durationMinutes: 18,
    reflection: 'In the beginning was the Word! Incredible revelation of Christ as light and truth.',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    reactions: {
      '🙏': ['user-sarah'],
      '💡': ['user-sarah', 'user-michael']
    },
    comments: []
  }
];

export const DEFAULT_NOTIFICATIONS: GroupNotification[] = [
  {
    id: 'notif-1',
    type: 'reading_completed',
    actorName: 'Sarah Jenkins',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Reading Completed',
    message: 'Sarah finished reading Hebrews 11:1–40 (Faith Chapter)',
    postId: 'post-sarah-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    type: 'reading_completed',
    actorName: 'David Miller',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Reading Completed',
    message: 'David finished reading John 1:1–18',
    postId: 'post-david-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: true
  }
];

export const DEFAULT_QUESTIONS: VerseQuestion[] = [
  {
    id: 'q-1',
    userId: 'user-sarah',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verseReference: 'John 15:5',
    bookId: 'john',
    questionText: "What does Jesus mean by 'apart from Me you can do nothing'? How does this work in our daily Bangalore work/study routine?",
    contextNote: 'Reading chapter 15 this morning on the True Vine.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    upvotes: ['user-david', 'user-michael'],
    answers: [
      {
        id: 'ans-1',
        userId: 'user-david',
        userName: 'David Miller',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'It means spiritual fruit and lasting peace only come when we remain connected to Him through prayer and humility, just like branches drawing sap from the vine.',
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        upvotes: ['user-sarah'],
        isBestAnswer: true
      }
    ]
  },
  {
    id: 'q-2',
    userId: 'user-michael',
    userName: 'Michael Chang',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    verseReference: 'Romans 8:28',
    bookId: 'romans',
    questionText: 'When friends go through heartbreak or layoffs, how should we share Romans 8:28 without sounding insensitive?',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    upvotes: ['user-david'],
    answers: [
      {
        id: 'ans-2',
        userId: 'user-sarah',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Paul wrote this from imprisonment and hardship. We should weep with those who weep first, and gently remind them that God will redeem their pain, rather than dismissing their grief.',
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        upvotes: ['user-michael', 'user-david']
      }
    ]
  }
];

class StorageService {
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- User Profile ---
  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.notify();
  }

  // --- Completed Chapters Matrix ---
  getCompletedChapters(): Record<string, number[]> {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      // Default initial progress for demo
      return {
        genesis: [1, 2, 3],
        psalms: [23, 91],
        john: [1, 2, 3]
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  setCompletedChapters(chapters: Record<string, number[]>): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(chapters));
    this.notify();
  }

  toggleChapter(bookId: string, chapter: number): void {
    const current = this.getCompletedChapters();
    const key = bookId.toLowerCase();
    const list = current[key] || [];
    const exists = list.includes(chapter);
    const updated = exists ? list.filter((c) => c !== chapter) : [...list, chapter];
    
    current[key] = updated;
    this.setCompletedChapters(current);
  }

  recordChaptersRead(bookId: string, startCh: number, endCh: number): void {
    const current = this.getCompletedChapters();
    const key = bookId.toLowerCase();
    const list = current[key] || [];
    const set = new Set(list);
    for (let c = startCh; c <= endCh; c++) {
      set.add(c);
    }
    current[key] = Array.from(set).sort((a, b) => a - b);
    this.setCompletedChapters(current);

    // Update streak on user profile
    const user = this.getUser();
    if (user) {
      const todayStr = new Date().toISOString().split('T')[0];
      const isNewDay = user.lastReadDate !== todayStr;
      const updatedUser: UserProfile = {
        ...user,
        streakDays: isNewDay ? user.streakDays + 1 : Math.max(1, user.streakDays),
        lastReadDate: todayStr
      };
      this.setUser(updatedUser);
    }
  }

  // --- Posts ---
  getPosts(): ReadingPost[] {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_FRIEND_POSTS));
      return DEFAULT_FRIEND_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_FRIEND_POSTS;
    }
  }

  addPost(post: ReadingPost): void {
    const posts = this.getPosts();
    const updated = [post, ...posts];
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    this.notify();
  }

  toggleReaction(postId: string, emoji: string, userId: string): void {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!post.reactions) post.reactions = {};
    const users = post.reactions[emoji] || [];
    if (users.includes(userId)) {
      post.reactions[emoji] = users.filter((u) => u !== userId);
    } else {
      post.reactions[emoji] = [...users, userId];
    }

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    this.notify();
  }

  addComment(postId: string, comment: { userId: string; userName: string; userAvatar: string; text: string }): void {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!post.comments) post.comments = [];
    post.comments.push({
      ...comment,
      id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    this.notify();
  }

  // --- Notifications ---
  getNotifications(): GroupNotification[] {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  addNotification(notif: Omit<GroupNotification, 'id' | 'timestamp' | 'read'>): GroupNotification {
    const all = this.getNotifications();
    const created: GroupNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updated = [created, ...all];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    this.notify();
    return created;
  }

  markAllNotificationsRead(): void {
    const all = this.getNotifications();
    const updated = all.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    this.notify();
  }

  getUnreadNotificationsCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  }

  // --- Verse Questions & Answers ---
  getQuestions(): VerseQuestion[] {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(DEFAULT_QUESTIONS));
      return DEFAULT_QUESTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_QUESTIONS;
    }
  }

  addQuestion(question: Omit<VerseQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers'>): VerseQuestion {
    const all = this.getQuestions();
    const created: VerseQuestion = {
      ...question,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: [],
      answers: []
    };
    const updated = [created, ...all];
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updated));
    this.notify();
    return created;
  }

  addAnswer(questionId: string, answer: { userId: string; userName: string; userAvatar: string; text: string }): void {
    const all = this.getQuestions();
    const q = all.find((item) => item.id === questionId);
    if (!q) return;

    const newAns: QuestionAnswer = {
      ...answer,
      id: `ans-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: []
    };
    q.answers.push(newAns);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));

    // Also add notification for question author
    this.addNotification({
      type: 'question_answered',
      actorName: answer.userName,
      actorAvatar: answer.userAvatar,
      title: 'Question Answered',
      message: `${answer.userName} replied to your question on ${q.verseReference}`,
      questionId
    });

    this.notify();
  }

  toggleQuestionUpvote(questionId: string, userId: string): void {
    const all = this.getQuestions();
    const q = all.find((item) => item.id === questionId);
    if (!q) return;

    if (q.upvotes.includes(userId)) {
      q.upvotes = q.upvotes.filter((u) => u !== userId);
    } else {
      q.upvotes.push(userId);
    }
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
    this.notify();
  }

  toggleAnswerUpvote(questionId: string, answerId: string, userId: string): void {
    const all = this.getQuestions();
    const q = all.find((item) => item.id === questionId);
    if (!q) return;

    const ans = q.answers.find((a) => a.id === answerId);
    if (!ans) return;

    if (ans.upvotes.includes(userId)) {
      ans.upvotes = ans.upvotes.filter((u) => u !== userId);
    } else {
      ans.upvotes.push(userId);
    }
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
    this.notify();
  }
}

export const BibleRealDB = new StorageService();

