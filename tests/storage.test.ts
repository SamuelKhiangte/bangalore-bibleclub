import { describe, it, expect, beforeEach } from 'vitest';
import { BibleRealDB } from '../src/services/storage.ts';
import type { UserProfile, ReadingPost } from '../src/types/index.ts';

describe('Storage Service (BibleRealDB)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('manages user profile persistence', () => {
    expect(BibleRealDB.getUser()).toBeNull();
    const testUser: UserProfile = {
      id: 'test-user-1',
      phoneNumber: '+15551234567',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://example.com/avatar.jpg',
      streakDays: 3,
      lastReadDate: '2026-10-04',
      joinedAt: '2026-10-01'
    };

    BibleRealDB.setUser(testUser);
    expect(BibleRealDB.getUser()?.name).toBe('John Doe');

    BibleRealDB.setUser(null);
    expect(BibleRealDB.getUser()).toBeNull();
  });

  it('initializes default friend posts and records new post', () => {
    const posts = BibleRealDB.getPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);

    const newPost: ReadingPost = {
      id: 'test-post',
      userId: 'test-user-1',
      userName: 'John Doe',
      userAvatar: 'https://example.com/avatar.jpg',
      startPhotoUrl: 'data:image/svg+xml;test',
      endPhotoUrl: 'data:image/svg+xml;test',
      bookId: 'romans',
      bookName: 'Romans',
      startChapter: 8,
      startVerse: 1,
      endChapter: 8,
      endVerse: 39,
      chaptersCount: 1,
      durationMinutes: 15,
      createdAt: new Date().toISOString(),
      reactions: {},
      comments: []
    };

    BibleRealDB.addPost(newPost);
    const updated = BibleRealDB.getPosts();
    expect(updated[0].id).toBe('test-post');
  });

  it('handles reactions and comments', () => {
    const posts = BibleRealDB.getPosts();
    const firstPostId = posts[0].id;

    BibleRealDB.toggleReaction(firstPostId, '🔥', 'user-tester');
    let current = BibleRealDB.getPosts().find((p) => p.id === firstPostId);
    expect(current?.reactions['🔥']).toContain('user-tester');

    // Toggle off
    BibleRealDB.toggleReaction(firstPostId, '🔥', 'user-tester');
    current = BibleRealDB.getPosts().find((p) => p.id === firstPostId);
    expect(current?.reactions['🔥']).not.toContain('user-tester');

    // Add comment
    BibleRealDB.addComment(firstPostId, {
      userId: 'user-tester',
      userName: 'Tester',
      userAvatar: '',
      text: 'Great reading!'
    });
    current = BibleRealDB.getPosts().find((p) => p.id === firstPostId);
    expect(current?.comments.some((c) => c.text === 'Great reading!')).toBe(true);
  });

  it('manages notifications queue and unread counter', () => {
    BibleRealDB.markAllNotificationsRead();
    expect(BibleRealDB.getUnreadNotificationsCount()).toBe(0);

    BibleRealDB.addNotification({
      type: 'reading_completed',
      actorName: 'Peter',
      actorAvatar: '',
      title: 'Finished Matthew',
      message: 'Peter completed Matthew 5:1–48'
    });

    expect(BibleRealDB.getUnreadNotificationsCount()).toBe(1);
  });
});
