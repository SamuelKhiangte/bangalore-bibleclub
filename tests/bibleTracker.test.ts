import { describe, it, expect } from 'vitest';
import {
  BIBLE_BOOKS,
  calculateBibleProgress,
  calculateStreak,
  validatePassageRange
} from '../src/services/bibleTracker.ts';

describe('Bible Tracker Engine', () => {
  it('contains exactly 66 books and 1189 total chapters', () => {
    expect(BIBLE_BOOKS).toHaveLength(66);
    const totalChapters = BIBLE_BOOKS.reduce((sum, b) => sum + b.chaptersCount, 0);
    expect(totalChapters).toBe(1189);
  });

  it('correctly calculates overall, OT, and NT completion percentage', () => {
    const stats = calculateBibleProgress({
      genesis: [1, 2, 3], // 3 chapters
      matthew: [1] // 1 chapter
    });
    expect(stats.totalChaptersRead).toBe(4);
    expect(stats.otChaptersRead).toBe(3);
    expect(stats.ntChaptersRead).toBe(1);
    expect(stats.percentage).toBeCloseTo((4 / 1189) * 100, 2);
  });

  it('computes daily streaks accurately', () => {
    const today = new Date().toISOString().split('T')[0];
    const res = calculateStreak(today, 5);
    expect(res.streak).toBe(5);
    expect(res.isToday).toBe(true);
  });

  it('validates passage ranges against chapter counts', () => {
    expect(validatePassageRange('genesis', 1, 3)).toBe(true);
    expect(validatePassageRange('genesis', 5, 2)).toBe(false); // inverted
    expect(validatePassageRange('genesis', 1, 99)).toBe(false); // genesis has 50 chapters
    expect(validatePassageRange('nonexistent', 1, 2)).toBe(false);
  });
});
