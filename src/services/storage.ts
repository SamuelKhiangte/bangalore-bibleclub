import type { UserProfile, ReadingPost, GroupNotification, VerseQuestion, QuestionAnswer, PrayerRequest, LeaderboardEntry } from '../types/index.ts';

const USER_KEY = 'bangalore_bibleclub_user';
const PROGRESS_KEY = 'bangalore_bibleclub_completed_chapters';
const POSTS_KEY = 'bangalore_bibleclub_posts';
const NOTIFICATIONS_KEY = 'bangalore_bibleclub_notifications';
const QUESTIONS_KEY = 'bangalore_bibleclub_questions';
const PRAYERS_KEY = 'bangalore_bibleclub_prayers';

export const DEFAULT_FRIEND_POSTS: ReadingPost[] = [];
export const DEFAULT_NOTIFICATIONS: GroupNotification[] = [];
export const DEFAULT_QUESTIONS: VerseQuestion[] = [];


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

  // --- Posts Storage (Permanent Persistence) ---
  getAllPosts(): ReadingPost[] {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: ReadingPost[] = JSON.parse(raw);
      const filtered = parsed.filter(
        (p) => !['user-sarah', 'user-david', 'user-michael', 'user-hannah'].includes(p.userId)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  }

  // --- Active Daily Feed (Photos & Posts expire after 24 hours / 1 day) ---
  getPosts(): ReadingPost[] {
    const all = this.getAllPosts();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return all.filter((p) => new Date(p.createdAt).getTime() >= oneDayAgo);
  }

  // --- User Personal Archive (All historical reading snaps remain saved) ---
  getUserArchive(userId: string): ReadingPost[] {
    return this.getAllPosts().filter((p) => p.userId === userId);
  }

  addPost(post: ReadingPost): void {
    const posts = this.getAllPosts();
    const updated = [post, ...posts];
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    this.notify();
  }

  toggleReaction(postId: string, emoji: string, userId: string): void {
    const posts = this.getAllPosts();
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
    const posts = this.getAllPosts();
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
      return [];
    }
    try {
      const parsed: GroupNotification[] = JSON.parse(raw);
      const filtered = parsed.filter(
        (n) => !['Sarah Jenkins', 'David Miller', 'Michael Chang', 'Hannah Abbott'].includes(n.actorName)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
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
      return [];
    }
    try {
      const parsed: VerseQuestion[] = JSON.parse(raw);
      const filtered = parsed.filter(
        (q) => !['user-sarah', 'user-david', 'user-michael', 'user-hannah'].includes(q.userId)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
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
  // --- Prayer Points Wall ---
  getPrayerRequests(): PrayerRequest[] {
    const raw = localStorage.getItem(PRAYERS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addPrayerRequest(prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'prayingUserIds'>): PrayerRequest {
    const all = this.getPrayerRequests();
    const created: PrayerRequest = {
      ...prayer,
      id: `prayer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      prayingUserIds: []
    };
    const updated = [created, ...all];
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(updated));
    this.notify();
    return created;
  }

  togglePraying(prayerId: string, userId: string): void {
    const all = this.getPrayerRequests();
    const item = all.find((p) => p.id === prayerId);
    if (!item) return;

    if (item.prayingUserIds.includes(userId)) {
      item.prayingUserIds = item.prayingUserIds.filter((id) => id !== userId);
    } else {
      item.prayingUserIds.push(userId);
      if (!item.isAnonymous && item.userId !== userId) {
        const user = this.getUser();
        this.addNotification({
          type: 'prayer_support',
          actorName: user?.name || 'A circle member',
          actorAvatar: user?.avatarUrl || '',
          title: 'Prayer Support',
          message: `${user?.name || 'A circle member'} is praying for: "${item.title}"`,
          prayerId
        });
      }
    }
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(all));
    this.notify();
  }

  togglePrayerAnswered(prayerId: string): void {
    const all = this.getPrayerRequests();
    const item = all.find((p) => p.id === prayerId);
    if (!item) return;

    item.isAnswered = !item.isAnswered;
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(all));
    this.notify();
  }

  deletePrayerRequest(prayerId: string, userId: string): void {
    const all = this.getPrayerRequests();
    const filtered = all.filter((p) => p.id !== prayerId || p.userId !== userId);
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(filtered));
    this.notify();
  }

  // --- Leaderboard Calculation ---
  getLeaderboard(): LeaderboardEntry[] {
    const user = this.getUser();
    const completedRecord = this.getCompletedChapters();
    let chaptersCount = 0;
    Object.values(completedRecord).forEach((list) => {
      chaptersCount += list.length;
    });
    const streakDays = user?.streakDays || (chaptersCount > 0 ? 1 : 0);
    const userPercentage = Number(((chaptersCount / 1189) * 100).toFixed(1));

    const currentUserEntry: LeaderboardEntry = {
      userId: user?.id || 'current-user',
      userName: user?.name ? `${user.name} (You)` : 'You',
      userAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      chaptersRead: chaptersCount,
      streakDays: streakDays,
      percentageCompleted: userPercentage,
      rank: 1,
      isCurrentUser: true
    };

    // Calculate other participants from all historical posts
    const allPosts = this.getAllPosts();
    const otherUsersMap = new Map<string, { name: string; avatar: string; chapters: number; lastPost: string }>();

    allPosts.forEach((p) => {
      if (p.userId !== user?.id) {
        const existing = otherUsersMap.get(p.userId) || {
          name: p.userName,
          avatar: p.userAvatar,
          chapters: 0,
          lastPost: p.createdAt
        };
        existing.chapters += (p.chaptersCount || 1);
        otherUsersMap.set(p.userId, existing);
      }
    });

    const list: LeaderboardEntry[] = [currentUserEntry];

    otherUsersMap.forEach((val, id) => {
      list.push({
        userId: id,
        userName: val.name,
        userAvatar: val.avatar,
        chaptersRead: val.chapters,
        streakDays: 1,
        percentageCompleted: Number(((val.chapters / 1189) * 100).toFixed(1)),
        rank: 0,
        isCurrentUser: false
      });
    });

    // Sort descending by chaptersRead, then streakDays
    list.sort((a, b) => {
      if (b.chaptersRead !== a.chaptersRead) {
        return b.chaptersRead - a.chaptersRead;
      }
      return b.streakDays - a.streakDays;
    });

    // Assign rank
    return list.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }
}

export const BibleRealDB = new StorageService();

