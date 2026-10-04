# BibleReal: BeReal for Bible Reading — Design Specification

## 1. Overview & Vision
BibleReal is a mobile-first web application (PWA) designed to foster daily Bible reading habits and community accountability. Inspired by BeReal, users log their daily Bible reading journey by snapping two camera photos: one of the starting verse and one of the ending verse. The app tracks overall Bible completion across all 66 books (1,189 chapters), maintains daily streaks, and broadcasts instant completion notifications to friends within the reading circle.

---

## 2. Core Architecture & Tech Stack

- **Framework**: React 18 + Vite (SPA / PWA architecture)
- **Styling**: Vanilla CSS / modern CSS variables with mobile viewport containment, sleek dark theme (obsidian `#090D16`, slate `#1E293B`, amber gold `#F59E0B`, emerald `#10B981`), glassmorphism cards, and fluid micro-animations.
- **Icons**: Lucide React icons.
- **Audio / Media**: HTML5 MediaDevices / WebRTC Camera (`navigator.mediaDevices.getUserMedia`) with canvas capture fallback. Web Audio API synthesized notification chimes.
- **Storage & State**: Self-contained client-side state with `localStorage` persistence layer (`BibleRealDB`) managing:
  - Current user profile & authentication session
  - Reading history & completed chapters matrix
  - Friends circle posts, comments, and reactions
  - Notification history & unread badges

---

## 3. Detailed Component & Feature Design

### 3.1 Authentication & Onboarding
- **Phone Number Entry**:
  - Country code selection (e.g. +1 US, +44 UK, +91 IN, etc.) with validated phone number input.
  - "Send Verification Code" action triggers simulated SMS dispatch.
- **Interactive Simulated SMS OTP**:
  - Top sliding iOS-style push notification banner displays a 6-digit OTP code (e.g., `582-901`).
  - One-tap autofill capability automatically fills the 6 individual OTP input boxes.
  - 30-second countdown for resending code.
- **Profile Initialization**:
  - Set Display Name, Username, and Avatar (preset biblical/nature iconography or custom selfie/photo upload).
  - Session automatically persisted so the user remains logged in.

### 3.2 Reading Journey & Dual-Camera Capture
- **Two-Photo Flow**:
  - **Photo 1 (Start Verse)**: Captures opening passage in physical or digital Bible.
  - **Photo 2 (End Verse)**: Captures final verse read in the session.
- **Camera Viewfinder**:
  - Live video stream using front or rear facing camera (`facingMode: environment` or `user`).
  - Shutter button with flash and haptic visual feedback.
  - File upload / sample photo library fallback for environments without an active camera.
  - Step progress indicator (`Step 1 of 2: Snap Starting Verse` $\rightarrow$ `Step 2 of 2: Snap Ending Verse`).
- **Passage Metadata**:
  - Book selector (searchable list of all 66 books from Genesis to Revelation).
  - Starting chapter & verse to ending chapter & verse inputs.
  - Reading duration timer (auto-tracked from start of session or editable).
  - Optional reflection / takeaway note.
- **BeReal-Style Dual Preview Card**:
  - Main photo with picture-in-picture floating overlay of the second photo.
  - Tapping the overlay swaps the active display photo with a smooth card flip animation.
  - Post button publishes the reading session to the friends circle.

### 3.3 Bible Reading Progress Tracker
- **Canon Model**:
  - Complete index of all 66 books:
    - 39 Old Testament books (929 chapters)
    - 27 New Testament books (260 chapters)
    - Total: 1,189 chapters
- **Metrics Dashboard**:
  - **Circular Progress Gauge**: Total chapters completed / 1,189 (e.g., 2.4% Completed).
  - **OT / NT Progress Bars**: Distinct bars tracking Old vs. New Testament progression.
  - **Streak Engine**: Daily streak counter with flame badge and last-read date verification.
  - **Interactive Chapter Matrix**: Drill-down modal or page for each book showing a grid of numbered chapter badges. Users can manually toggle chapters as read/unread.

### 3.4 Friends Circle Feed & Real-Time Group Notifications
- **Friends Circle Feed**:
  - Displays daily reading logs from friends in chronological order.
  - BeReal dual-photo card with tap-to-swap feature.
  - User avatar, name, Bible passage badge (e.g. `Hebrews 11:1–40`), timestamp, and streak count.
  - Reflection text snippet.
- **Reactions & Encouragement**:
  - RealMoji style reactions: 🙏 (Amen), ❤️ (Love), 🔥 (Fire), 💡 (Inspired), 📖 (Bookmarked).
  - Encouraging comment thread per post.
- **Instant Group Notifications**:
  - Whenever a friend finishes a reading session, an animated notification banner appears at the top:
    *"Sarah completed John 1:1–18! Tap to congratulate."*
  - Accompanied by a gentle audio chime.
  - Notification drawer with list of historical notifications and unread dot indicator.
  - "Simulate Friend Reading" quick action button in development menu to demonstrate notification triggers on demand.

### 3.5 Responsive Presentation Shell
- Desktop experience displays a realistic mobile phone bezel frame (iPhone style) with status bar, notch, and home indicator.
- Floating toggle button allows switching between "Mobile Frame" and "Full Width" mode for desktop/tablet convenience.
- Bottom navigation bar:
  - 🏠 Feed (Friends Circle)
  - ➕ Read (Dual-Camera Capture)
  - 📊 Progress (Bible Tracker & Chapters)
  - 🔔 Alerts (Notification Tray)
  - 👤 Profile (User Stats & Settings)

---

## 4. Data Models

```typescript
interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  username: string;
  avatarUrl: string;
  streakDays: number;
  lastReadDate: string | null;
  joinedAt: string;
}

interface ReadingPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  startPhotoUrl: string;
  endPhotoUrl: string;
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  chaptersReadCount: number;
  durationMinutes: number;
  reflection?: string;
  createdAt: string;
  reactions: { [emoji: string]: string[] }; // emoji -> array of userIds
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
  }>;
}

interface BibleProgress {
  // bookId -> Set of completed chapter numbers
  completedChapters: { [bookId: string]: number[] };
  totalChaptersRead: number;
  streakDays: number;
  lastReadDate: string | null;
}

interface GroupNotification {
  id: string;
  type: 'reading_completed' | 'reaction' | 'comment';
  actorName: string;
  actorAvatar: string;
  title: string;
  message: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}
```

---

## 5. Error Handling & Edge Cases
- **Camera Permission Denied / Unavailable**: Automatically offer camera permission retry prompt or seamless fallback to upload local photos or pick from curated sample Bible verse photos.
- **Offline / Local Persistence**: All reads, streaks, posts, and notification states are saved in `localStorage` and automatically loaded on boot.
- **Invalid OTP Entry**: Displays shake animation and clear error message with resend option.
- **Chapter Range Validation**: Validates that start chapter $\le$ end chapter and verses are within valid book boundaries.

---

## 6. Testing & Verification Plan
1. **Auth Flow**: Test phone input $\rightarrow$ verify simulated SMS notification appears with 6-digit code $\rightarrow$ test one-tap autofill $\rightarrow$ test profile setup.
2. **Camera & Capture**: Verify dual-photo capture sequence (Photo 1 then Photo 2) $\rightarrow$ verify tap-to-swap dual preview $\rightarrow$ submit post.
3. **Feed & Social**: Verify newly published post appears in Friends Circle feed $\rightarrow$ verify reactions & comments update live.
4. **Progress Tracker**: Verify chapters logged from post increment Bible progress, update Old/New Testament counters, and streak updates. Verify interactive chapter grid toggle.
5. **Notification System**: Trigger "Simulate Friend Reading" $\rightarrow$ confirm in-app banner appears with sound and notification tray count increments $\rightarrow$ clicking banner navigates to post.
