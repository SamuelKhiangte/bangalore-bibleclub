import type {
  UserProfile,
  ReadingPost,
  GroupNotification,
  VerseQuestion,
  QuestionAnswer,
  PrayerRequest,
  LeaderboardEntry
} from '../types/index.ts';
import { supabase, uploadReadingPhoto } from './supabase.ts';

const USER_KEY = 'bangalore_bibleclub_user';
const PROGRESS_KEY = 'bangalore_bibleclub_completed_chapters';
const POSTS_KEY = 'bangalore_bibleclub_posts';
const NOTIFICATIONS_KEY = 'bangalore_bibleclub_notifications';
const QUESTIONS_KEY = 'bangalore_bibleclub_questions';
const PRAYERS_KEY = 'bangalore_bibleclub_prayers';
const CIRCLE_PROGRESS_KEY = 'bangalore_bibleclub_circle_progress';

export const DEFAULT_FRIEND_POSTS: ReadingPost[] = [];
export const DEFAULT_NOTIFICATIONS: GroupNotification[] = [];
export const DEFAULT_QUESTIONS: VerseQuestion[] = [];

class StorageService {
  private listeners: Array<() => void> = [];
  private isCloudInitialized = false;

  constructor() {
    // Automatically initialize cloud sync in the browser
    if (typeof window !== 'undefined') {
      this.initCloudSync();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Real-time Cloud Synchronization ---
  async initCloudSync(): Promise<void> {
    if (this.isCloudInitialized) return;
    this.isCloudInitialized = true;

    try {
      // 1. Initial parallel fetch from Supabase
      await Promise.allSettled([
        this.fetchCloudPosts(),
        this.fetchCloudPrayers(),
        this.fetchCloudQuestions(),
        this.fetchCloudCircleProgress()
      ]);

      // 2. Setup Supabase Realtime WebSocket Listener
      supabase
        .channel('bangalore-bibleclub-circle')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'reading_posts' },
          (payload) => {
            this.handleCloudPostChange(payload);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'prayer_requests' },
          (payload) => {
            this.handleCloudPrayerChange(payload);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_progress' },
          () => {
            this.fetchCloudCircleProgress();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'verse_questions' },
          () => {
            this.fetchCloudQuestions();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Supabase cloud sync initialization note:', err);
    }
  }

  private async fetchCloudPosts(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('reading_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data) return;

      const formatted: ReadingPost[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        startPhotoUrl: row.start_photo_url,
        endPhotoUrl: row.end_photo_url,
        bookId: row.book_id,
        bookName: row.book_name,
        startChapter: row.start_chapter,
        startVerse: row.start_verse,
        endChapter: row.end_chapter,
        endVerse: row.end_verse,
        chaptersCount: row.chapters_count || 1,
        durationMinutes: row.duration_minutes || 15,
        reflection: row.reflection || undefined,
        reactions: row.reactions || {},
        comments: row.comments || [],
        createdAt: row.created_at
      }));

      // Merge with any offline local posts
      const local = this.getAllPosts();
      const map = new Map<string, ReadingPost>();
      formatted.forEach((p) => map.set(p.id, p));
      local.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      localStorage.setItem(POSTS_KEY, JSON.stringify(merged));
      this.notify();
    } catch (err) {
      console.warn('Could not fetch cloud posts:', err);
    }
  }

  private async fetchCloudPrayers(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data) return;

      const formatted: PrayerRequest[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        isAnonymous: row.is_anonymous,
        title: row.title,
        description: row.description,
        prayingUserIds: row.praying_user_ids || [],
        isAnswered: row.is_answered,
        createdAt: row.created_at
      }));

      localStorage.setItem(PRAYERS_KEY, JSON.stringify(formatted));
      this.notify();
    } catch (err) {
      console.warn('Could not fetch cloud prayers:', err);
    }
  }

  private async fetchCloudQuestions(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('verse_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data) return;

      const formatted: VerseQuestion[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        verseReference: row.verse_reference,
        bookId: row.book_id,
        questionText: row.question_text,
        contextNote: row.context_note || undefined,
        upvotes: row.upvotes || [],
        answers: row.answers || [],
        createdAt: row.created_at
      }));

      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(formatted));
      this.notify();
    } catch (err) {
      console.warn('Could not fetch cloud questions:', err);
    }
  }

  private async fetchCloudCircleProgress(): Promise<void> {
    try {
      const { data, error } = await supabase.from('user_progress').select('*');
      if (error || !data) return;

      localStorage.setItem(CIRCLE_PROGRESS_KEY, JSON.stringify(data));
      this.notify();
    } catch (err) {
      console.warn('Could not fetch circle progress:', err);
    }
  }

  private handleCloudPostChange(payload: any): void {
    if (payload.eventType === 'INSERT') {
      const row = payload.new;
      const post: ReadingPost = {
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        startPhotoUrl: row.start_photo_url,
        endPhotoUrl: row.end_photo_url,
        bookId: row.book_id,
        bookName: row.book_name,
        startChapter: row.start_chapter,
        startVerse: row.start_verse,
        endChapter: row.end_chapter,
        endVerse: row.end_verse,
        chaptersCount: row.chapters_count || 1,
        durationMinutes: row.duration_minutes || 15,
        reflection: row.reflection || undefined,
        reactions: row.reactions || {},
        comments: row.comments || [],
        createdAt: row.created_at
      };

      const all = this.getAllPosts();
      if (!all.some((p) => p.id === post.id)) {
        const updated = [post, ...all];
        localStorage.setItem(POSTS_KEY, JSON.stringify(updated));

        // Trigger local notification if posted by a friend
        const currentUser = this.getUser();
        if (currentUser && post.userId !== currentUser.id) {
          this.addNotification({
            type: 'reading_completed',
            actorName: post.userName,
            actorAvatar: post.userAvatar,
            title: 'Reading Completed',
            message: `${post.userName} read ${post.bookName} ${post.startChapter}:${post.startVerse}!`,
            postId: post.id
          });
        }
        this.notify();
      }
    } else if (payload.eventType === 'UPDATE') {
      const row = payload.new;
      const all = this.getAllPosts().map((p) => {
        if (p.id === row.id) {
          return {
            ...p,
            reactions: row.reactions || {},
            comments: row.comments || []
          };
        }
        return p;
      });
      localStorage.setItem(POSTS_KEY, JSON.stringify(all));
      this.notify();
    } else if (payload.eventType === 'DELETE') {
      const id = payload.old?.id;
      if (id) {
        const filtered = this.getAllPosts().filter((p) => p.id !== id);
        localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
        this.notify();
      }
    }
  }

  private handleCloudPrayerChange(payload: any): void {
    if (payload.eventType === 'INSERT') {
      const row = payload.new;
      const prayer: PrayerRequest = {
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        isAnonymous: row.is_anonymous,
        title: row.title,
        description: row.description,
        prayingUserIds: row.praying_user_ids || [],
        isAnswered: row.is_answered,
        createdAt: row.created_at
      };

      const all = this.getPrayerRequests();
      if (!all.some((p) => p.id === prayer.id)) {
        localStorage.setItem(PRAYERS_KEY, JSON.stringify([prayer, ...all]));
        this.notify();
      }
    } else if (payload.eventType === 'UPDATE') {
      const row = payload.new;
      const all = this.getPrayerRequests().map((p) => {
        if (p.id === row.id) {
          return {
            ...p,
            prayingUserIds: row.praying_user_ids || [],
            isAnswered: row.is_answered
          };
        }
        return p;
      });
      localStorage.setItem(PRAYERS_KEY, JSON.stringify(all));
      this.notify();
    } else if (payload.eventType === 'DELETE') {
      const id = payload.old?.id;
      if (id) {
        const filtered = this.getPrayerRequests().filter((p) => p.id !== id);
        localStorage.setItem(PRAYERS_KEY, JSON.stringify(filtered));
        this.notify();
      }
    }
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
      // Sync user profile to cloud user_progress
      this.syncUserProgressToCloud(user);
    }
    this.notify();
  }

  private async syncUserProgressToCloud(user: UserProfile): Promise<void> {
    try {
      const completed = this.getCompletedChapters();
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatarUrl,
        completed_chapters: completed,
        streak_days: user.streakDays,
        last_read_date: user.lastReadDate,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not sync user progress to cloud:', err);
    }
  }

  // --- Completed Chapters Matrix ---
  getCompletedChapters(): Record<string, number[]> {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return {};
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

    const user = this.getUser();
    if (user) {
      this.syncUserProgressToCloud(user);
    }
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
      const todayStr = new Date().toDateString();
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

  // --- Active Daily Feed (Photos & Posts expire after 24 hours) ---
  getPosts(): ReadingPost[] {
    const all = this.getAllPosts();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return all.filter((p) => new Date(p.createdAt).getTime() >= oneDayAgo);
  }

  // --- User Personal Archive (All historical reading snaps remain saved) ---
  getUserArchive(userId: string): ReadingPost[] {
    return this.getAllPosts().filter((p) => p.userId === userId);
  }

  async addPost(post: ReadingPost): Promise<void> {
    // 1. Optimistic local update for instantaneous UI feedback
    const posts = this.getAllPosts();
    const updated = [post, ...posts];
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    this.notify();

    // 2. Asynchronously upload photos to Supabase Storage & insert row into database
    try {
      const [uploadedStart, uploadedEnd] = await Promise.all([
        uploadReadingPhoto(post.startPhotoUrl, `${post.userId}-start`),
        post.endPhotoUrl ? uploadReadingPhoto(post.endPhotoUrl, `${post.userId}-end`) : Promise.resolve('')
      ]);

      const cloudPost = {
        id: post.id,
        user_id: post.userId,
        user_name: post.userName,
        user_avatar: post.userAvatar,
        start_photo_url: uploadedStart,
        end_photo_url: uploadedEnd,
        book_id: post.bookId,
        book_name: post.bookName,
        start_chapter: post.startChapter,
        start_verse: post.startVerse,
        end_chapter: post.endChapter,
        end_verse: post.endVerse,
        chapters_count: post.chaptersCount,
        duration_minutes: post.durationMinutes,
        reflection: post.reflection || null,
        reactions: post.reactions || {},
        comments: post.comments || [],
        created_at: post.createdAt
      };

      const { error } = await supabase.from('reading_posts').insert(cloudPost);
      if (error) {
        console.warn('Could not insert post to Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Cloud post upload error:', err);
    }
  }

  async toggleReaction(postId: string, emoji: string, userId: string): Promise<void> {
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

    try {
      await supabase
        .from('reading_posts')
        .update({ reactions: post.reactions })
        .eq('id', postId);
    } catch (err) {
      console.warn('Cloud reaction update note:', err);
    }
  }

  async addComment(
    postId: string,
    comment: { userId: string; userName: string; userAvatar: string; text: string }
  ): Promise<void> {
    const posts = this.getAllPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!post.comments) post.comments = [];
    const newComment = {
      ...comment,
      id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    post.comments.push(newComment);

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    this.notify();

    try {
      await supabase
        .from('reading_posts')
        .update({ comments: post.comments })
        .eq('id', postId);
    } catch (err) {
      console.warn('Cloud comment update note:', err);
    }
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

  async addQuestion(
    question: Omit<VerseQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers'>
  ): Promise<VerseQuestion> {
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

    try {
      await supabase.from('verse_questions').insert({
        id: created.id,
        user_id: created.userId,
        user_name: created.userName,
        user_avatar: created.userAvatar,
        verse_reference: created.verseReference,
        book_id: created.bookId,
        question_text: created.questionText,
        context_note: created.contextNote || null,
        upvotes: [],
        answers: [],
        created_at: created.createdAt
      });
    } catch (err) {
      console.warn('Could not insert question to cloud:', err);
    }

    return created;
  }

  async addAnswer(
    questionId: string,
    answer: { userId: string; userName: string; userAvatar: string; text: string }
  ): Promise<void> {
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

    try {
      await supabase
        .from('verse_questions')
        .update({ answers: q.answers })
        .eq('id', questionId);
    } catch (err) {
      console.warn('Could not sync answer to cloud:', err);
    }
  }

  async toggleQuestionUpvote(questionId: string, userId: string): Promise<void> {
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

    try {
      await supabase
        .from('verse_questions')
        .update({ upvotes: q.upvotes })
        .eq('id', questionId);
    } catch (err) {
      console.warn('Could not sync question upvote to cloud:', err);
    }
  }

  async toggleAnswerUpvote(questionId: string, answerId: string, userId: string): Promise<void> {
    const all = this.getQuestions();
    const q = all.find((item) => item.id === questionId);
    if (!q) return;
    const ans = q.answers.find((a) => a.id === answerId);
    if (!ans) return;

    if (!ans.upvotes) ans.upvotes = [];
    if (ans.upvotes.includes(userId)) {
      ans.upvotes = ans.upvotes.filter((u) => u !== userId);
    } else {
      ans.upvotes.push(userId);
    }
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
    this.notify();

    try {
      await supabase
        .from('verse_questions')
        .update({ answers: q.answers })
        .eq('id', questionId);
    } catch (err) {
      console.warn('Could not sync answer upvote to cloud:', err);
    }
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

  async addPrayerRequest(
    prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'prayingUserIds'>
  ): Promise<PrayerRequest> {
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

    try {
      await supabase.from('prayer_requests').insert({
        id: created.id,
        user_id: created.userId,
        user_name: created.userName,
        user_avatar: created.userAvatar,
        is_anonymous: created.isAnonymous,
        title: created.title,
        description: created.description,
        praying_user_ids: [],
        is_answered: false,
        created_at: created.createdAt
      });
    } catch (err) {
      console.warn('Could not sync prayer to cloud:', err);
    }

    return created;
  }

  async togglePraying(prayerId: string, userId: string): Promise<void> {
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

    try {
      await supabase
        .from('prayer_requests')
        .update({ praying_user_ids: item.prayingUserIds })
        .eq('id', prayerId);
    } catch (err) {
      console.warn('Could not sync praying status to cloud:', err);
    }
  }

  async togglePrayerAnswered(prayerId: string): Promise<void> {
    const all = this.getPrayerRequests();
    const item = all.find((p) => p.id === prayerId);
    if (!item) return;

    item.isAnswered = !item.isAnswered;
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(all));
    this.notify();

    try {
      await supabase
        .from('prayer_requests')
        .update({ is_answered: item.isAnswered })
        .eq('id', prayerId);
    } catch (err) {
      console.warn('Could not sync answered status to cloud:', err);
    }
  }

  async deletePrayerRequest(prayerId: string, userId: string): Promise<void> {
    const all = this.getPrayerRequests();
    const filtered = all.filter((p) => p.id !== prayerId || p.userId !== userId);
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(filtered));
    this.notify();

    try {
      await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', prayerId)
        .eq('user_id', userId);
    } catch (err) {
      console.warn('Could not delete prayer from cloud:', err);
    }
  }

  // --- Leaderboard Calculation (Syncs All Circle Friends Across Phones) ---
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
      userAvatar:
        user?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      chaptersRead: chaptersCount,
      streakDays: streakDays,
      percentageCompleted: userPercentage,
      rank: 1,
      isCurrentUser: true
    };

    // Read synced circle progress from other friends from cloud
    const rawCircleProgress = localStorage.getItem(CIRCLE_PROGRESS_KEY);
    const circleProgressRows: any[] = rawCircleProgress ? JSON.parse(rawCircleProgress) : [];

    const otherUsersMap = new Map<
      string,
      { name: string; avatar: string; chapters: number; streak: number }
    >();

    // 1. Populate from synced user_progress table
    circleProgressRows.forEach((row) => {
      if (row.user_id && row.user_id !== user?.id) {
        let count = 0;
        if (row.completed_chapters && typeof row.completed_chapters === 'object') {
          Object.values(row.completed_chapters).forEach((list: any) => {
            if (Array.isArray(list)) count += list.length;
          });
        }
        otherUsersMap.set(row.user_id, {
          name: row.user_name || 'Circle Member',
          avatar:
            row.user_avatar ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          chapters: count,
          streak: row.streak_days || 1
        });
      }
    });

    // 2. Also tally from any shared reading posts by friends
    const allPosts = this.getAllPosts();
    allPosts.forEach((p) => {
      if (p.userId && p.userId !== user?.id) {
        const existing = otherUsersMap.get(p.userId) || {
          name: p.userName,
          avatar: p.userAvatar,
          chapters: 0,
          streak: 1
        };
        existing.chapters = Math.max(existing.chapters, p.chaptersCount || 1);
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
        streakDays: val.streak,
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
