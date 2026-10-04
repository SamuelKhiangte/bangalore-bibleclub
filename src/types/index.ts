export interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  username: string;
  avatarUrl: string;
  streakDays: number;
  lastReadDate: string | null;
  joinedAt: string;
}

export interface ReadingPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  startPhotoUrl: string;
  endPhotoUrl: string;
  bookId: string;
  bookName: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  chaptersCount: number;
  durationMinutes: number;
  reflection?: string;
  createdAt: string;
  reactions: Record<string, string[]>; // emojiKey -> array of userIds
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
  }>;
}

export interface QuestionAnswer {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  upvotes: string[]; // userIds
  isBestAnswer?: boolean;
}

export interface VerseQuestion {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  verseReference: string; // e.g. "John 15:5"
  bookId: string;
  questionText: string;
  contextNote?: string;
  createdAt: string;
  upvotes: string[]; // userIds
  answers: QuestionAnswer[];
}

export interface GroupNotification {
  id: string;
  type: 'reading_completed' | 'reaction' | 'comment' | 'question_answered';
  actorName: string;
  actorAvatar: string;
  title: string;
  message: string;
  postId?: string;
  questionId?: string;
  timestamp: string;
  read: boolean;
}

export type ActiveTab = 'feed' | 'read' | 'progress' | 'notifications' | 'profile' | 'qa';
