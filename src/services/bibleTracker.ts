import {
  BIBLE_BOOKS,
  TOTAL_BIBLE_CHAPTERS,
  TOTAL_OT_CHAPTERS,
  TOTAL_NT_CHAPTERS,
  getBookById,
  type BibleBook
} from '../data/bibleCanon.ts';

export interface BibleProgressStats {
  totalChaptersRead: number;
  totalChapters: number;
  otChaptersRead: number;
  otTotalChapters: number;
  ntChaptersRead: number;
  ntTotalChapters: number;
  percentage: number;
  otPercentage: number;
  ntPercentage: number;
}

export { BIBLE_BOOKS };

/**
 * Calculates Bible reading progress stats given a mapping of bookId -> array of completed chapter numbers.
 */
export function calculateBibleProgress(
  completedChapters: Record<string, number[]>
): BibleProgressStats {
  let otChaptersRead = 0;
  let ntChaptersRead = 0;

  for (const book of BIBLE_BOOKS) {
    const readList = completedChapters[book.id.toLowerCase()] || [];
    // Deduplicate and filter to valid chapter bounds (1 to book.chaptersCount)
    const validUniqueChapters = Array.from(new Set(readList)).filter(
      (ch) => ch >= 1 && ch <= book.chaptersCount
    );

    if (book.testament === 'OT') {
      otChaptersRead += validUniqueChapters.length;
    } else {
      ntChaptersRead += validUniqueChapters.length;
    }
  }

  const totalChaptersRead = otChaptersRead + ntChaptersRead;
  const percentage = (totalChaptersRead / TOTAL_BIBLE_CHAPTERS) * 100;
  const otPercentage = (otChaptersRead / TOTAL_OT_CHAPTERS) * 100;
  const ntPercentage = (ntChaptersRead / TOTAL_NT_CHAPTERS) * 100;

  return {
    totalChaptersRead,
    totalChapters: TOTAL_BIBLE_CHAPTERS,
    otChaptersRead,
    otTotalChapters: TOTAL_OT_CHAPTERS,
    ntChaptersRead,
    ntTotalChapters: TOTAL_NT_CHAPTERS,
    percentage: Math.min(100, Math.round(percentage * 100) / 100),
    otPercentage: Math.min(100, Math.round(otPercentage * 100) / 100),
    ntPercentage: Math.min(100, Math.round(ntPercentage * 100) / 100)
  };
}

/**
 * Calculates user streak based on last read date string (YYYY-MM-DD) and current streak count.
 */
export function calculateStreak(
  lastReadDate: string | null,
  currentStreak: number
): { streak: number; isToday: boolean } {
  if (!lastReadDate) {
    return { streak: 0, isToday: false };
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (lastReadDate === todayStr) {
    return { streak: Math.max(1, currentStreak), isToday: true };
  }

  // Check if lastReadDate was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastReadDate === yesterdayStr) {
    return { streak: currentStreak, isToday: false };
  }

  // Older than yesterday -> streak reset
  return { streak: 0, isToday: false };
}

/**
 * Validates whether a book chapter range is logical and within boundaries.
 */
export function validatePassageRange(
  bookId: string,
  startCh: number,
  endCh: number
): boolean {
  const book = getBookById(bookId);
  if (!book) return false;
  if (startCh < 1 || endCh < 1) return false;
  if (startCh > book.chaptersCount || endCh > book.chaptersCount) return false;
  if (startCh > endCh) return false;
  return true;
}
