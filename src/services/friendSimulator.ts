import { BibleRealDB } from './storage.ts';
import { playNotificationChime } from './sound.ts';
import {
  SAMPLE_START_PHOTO,
  SAMPLE_END_PHOTO,
  SAMPLE_JOHN_START,
  SAMPLE_JOHN_END
} from '../data/sampleBiblePhotos.ts';
import type { ReadingPost, GroupNotification } from '../types/index.ts';

const SIMULATED_FRIENDS = [
  {
    userId: 'user-sarah',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    passage: { bookId: 'psalms', bookName: 'Psalms', startCh: 23, startV: 1, endCh: 23, endV: 6, chs: 1 },
    reflection: 'The Lord is my shepherd, I lack nothing. Such deep peace meditating on verse 1 today.',
    startPhoto: SAMPLE_START_PHOTO,
    endPhoto: SAMPLE_END_PHOTO
  },
  {
    userId: 'user-michael',
    userName: 'Michael Chang',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    passage: { bookId: 'philippians', bookName: 'Philippians', startCh: 4, startV: 4, endCh: 4, endV: 13, chs: 1 },
    reflection: 'I can do all things through Christ who strengthens me! Needed this encouragement today.',
    startPhoto: SAMPLE_JOHN_START,
    endPhoto: SAMPLE_JOHN_END
  },
  {
    userId: 'user-hannah',
    userName: 'Hannah Kim',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    passage: { bookId: 'romans', bookName: 'Romans', startCh: 12, startV: 1, endCh: 12, endV: 21, chs: 1 },
    reflection: 'Be transformed by the renewing of your mind. Powerful charge for our daily walk.',
    startPhoto: SAMPLE_START_PHOTO,
    endPhoto: SAMPLE_END_PHOTO
  }
];

let friendIndex = 0;

/**
 * Simulates a friend in the group completing a Bible verse reading session.
 * Creates post, adds notification to BibleRealDB, plays chime, and returns the notification.
 */
export function simulateFriendReading(): GroupNotification {
  const friend = SIMULATED_FRIENDS[friendIndex % SIMULATED_FRIENDS.length];
  friendIndex++;

  const verseRef = `${friend.passage.bookName} ${friend.passage.startCh}:${friend.passage.startV}–${
    friend.passage.startCh === friend.passage.endCh ? '' : `${friend.passage.endCh}:`
  }${friend.passage.endV}`;

  const newPost: ReadingPost = {
    id: `post-sim-${Date.now()}`,
    userId: friend.userId,
    userName: friend.userName,
    userAvatar: friend.userAvatar,
    startPhotoUrl: friend.startPhoto,
    endPhotoUrl: friend.endPhoto,
    bookId: friend.passage.bookId,
    bookName: friend.passage.bookName,
    startChapter: friend.passage.startCh,
    startVerse: friend.passage.startV,
    endChapter: friend.passage.endCh,
    endVerse: friend.passage.endV,
    chaptersCount: friend.passage.chs,
    durationMinutes: 12 + Math.floor(Math.random() * 10),
    reflection: friend.reflection,
    createdAt: new Date().toISOString(),
    reactions: {
      '🙏': [friend.userId]
    },
    comments: []
  };

  // Add post to feed
  BibleRealDB.addPost(newPost);

  // Play audio alert
  playNotificationChime();

  // Create & return notification
  const notification = BibleRealDB.addNotification({
    type: 'reading_completed',
    actorName: friend.userName,
    actorAvatar: friend.userAvatar,
    title: 'Reading Completed',
    message: `${friend.userName} completed ${verseRef}!`,
    postId: newPost.id
  });

  return notification;
}
