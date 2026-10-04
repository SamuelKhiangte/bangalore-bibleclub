# BibleReal: BeReal for Bible Reading — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first web app (PWA) where users log their daily Bible reading with two camera photos (start and end verse), track their reading progress through the 66 books of the Bible, authenticate via phone OTP, and exchange real-time reading completion notifications and reactions with their friends circle.

**Architecture:** Client-side React 18 + TypeScript single page application with modern CSS tokens and glassmorphism styling. Employs HTML5 WebRTC MediaDevices for dual-camera capture, Web Audio API for sound chimes, and an encapsulated `BibleRealDB` persistence engine in `localStorage` backed by typed schemas. Includes a desktop phone bezel simulator with full-width toggle.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Lucide React, WebRTC Camera API, Web Audio API, Vanilla CSS with custom properties.

**Spec:** [docs/superpowers/specs/2026-10-05-bible-bereal-design.md](file:///Users/samuelkhiangte/Documents/codes/vibecode_app/docs/superpowers/specs/2026-10-05-bible-bereal-design.md)

## Global Constraints
- Target platform: Mobile-first Web App (responsive mobile container on desktop with toggle, immersive on mobile).
- Authentication: Phone number with simulated interactive SMS notification and 6-digit OTP autofill.
- Photos: Two photos per reading post (Start verse and End verse) with BeReal picture-in-picture tap-to-swap.
- Progress: Complete 66 Bible books with 1,189 chapters, streaks, and OT/NT progress tracking.
- Notifications: In-app real-time banner and sound chime when friends finish reading a Bible passage.
- Test coverage: Vitest unit tests for Bible calculations, persistence layer, and core logic.

---

### Task 1: Project Scaffolding & Design System

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Working React 18 + Vite + TypeScript application with Vitest test harness and global CSS design tokens.

- [ ] **Step 1: Write setup test**
Create `tests/setup.test.ts` checking environment and test runner sanity:
```typescript
import { describe, it, expect } from 'vitest';

describe('Project setup sanity', () => {
  it('runs tests successfully', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Initialize package.json and project files**
Create `package.json` with React 18, TypeScript, Vite, Vitest, Lucide React, and `@testing-library/react`.
Install dependencies using `npm install`.

- [ ] **Step 3: Create index.css with design tokens**
Define theme CSS variables (`--bg-primary: #090d16`, `--bg-card: rgba(30, 41, 59, 0.7)`, `--accent-gold: #f59e0b`, `--accent-emerald: #10b981`, etc.) along with typography, glassmorphism utilities, and phone mockup container styles.

- [ ] **Step 4: Run tests to verify test suite passes**
Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit scaffolding**
```bash
git add package.json tsconfig.json vite.config.ts index.html src/ tests/
git commit -m "chore: scaffold React Vite app with design tokens and Vitest"
```

---

### Task 2: Bible Canon Data & Progress Calculation Engine

**Files:**
- Create: `src/data/bibleCanon.ts`
- Create: `src/services/bibleTracker.ts`
- Test: `tests/bibleTracker.test.ts`

**Interfaces:**
- Produces:
  - `BIBLE_BOOKS: BibleBook[]` (66 books with id, name, testament, chaptersCount, genre)
  - `calculateBibleProgress(completedChapters: Record<string, number[]>): BibleProgressStats`
  - `calculateStreak(lastReadDate: string | null, currentStreak: number): { streak: number; isToday: boolean }`
  - `validatePassageRange(bookId: string, startCh: number, endCh: number): boolean`

- [ ] **Step 1: Write the failing tests**
Create `tests/bibleTracker.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { BIBLE_BOOKS, calculateBibleProgress, calculateStreak } from '../src/services/bibleTracker';

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
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/bibleTracker.test.ts`
Expected: FAIL with missing module.

- [ ] **Step 3: Implement Bible canon data and calculation engine**
Implement `src/data/bibleCanon.ts` and `src/services/bibleTracker.ts`.

- [ ] **Step 4: Run tests to verify it passes**
Run: `npm test tests/bibleTracker.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/data/ src/services/ tests/bibleTracker.test.ts
git commit -m "feat: implement Bible canon data and progress tracking engine"
```

---

### Task 3: Local Storage DB & Sound Notification Service

**Files:**
- Create: `src/types/index.ts`
- Create: `src/services/storage.ts`
- Create: `src/services/sound.ts`
- Test: `tests/storage.test.ts`

**Interfaces:**
- Produces:
  - `BibleRealDB` API: `getUser()`, `setUser()`, `getPosts()`, `addPost()`, `toggleReaction()`, `addComment()`, `getNotifications()`, `addNotification()`, `markNotificationsRead()`
  - `playNotificationChime(): void` (Web Audio API synthesized bell)
  - `DEFAULT_INITIAL_POSTS: ReadingPost[]` (pre-seeded active friend posts for immediate life)

- [ ] **Step 1: Write storage unit tests**
Create `tests/storage.test.ts` testing post creation, reaction toggling, and notification queues with local storage mock.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/storage.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement storage and sound services**
Create `src/types/index.ts` with all types.
Implement `src/services/storage.ts` with default seed data and CRUD operations.
Implement `src/services/sound.ts` with Web Audio API chime synthesis.

- [ ] **Step 4: Run tests to verify it passes**
Run: `npm test tests/storage.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/types/ src/services/ tests/storage.test.ts
git commit -m "feat: implement local persistence layer and audio chime service"
```

---

### Task 4: Phone Auth & Interactive OTP Screen

**Files:**
- Create: `src/components/auth/PhoneAuthModal.tsx`
- Create: `src/components/auth/OtpInput.tsx`
- Create: `src/components/auth/SimulatedSmsBanner.tsx`
- Create: `src/components/auth/ProfileSetupModal.tsx`
- Test: `tests/auth.test.ts`

**Interfaces:**
- Consumes: `BibleRealDB.setUser`, `BibleRealDB.getUser`
- Produces: `<PhoneAuthFlow onLoginSuccess={(user: UserProfile) => void} />`

- [ ] **Step 1: Write auth logic test**
Verify OTP generation, validation, and session login state transition.

- [ ] **Step 2: Implement SMS simulation & OTP input components**
- `SimulatedSmsBanner.tsx`: Top notification banner displaying incoming code with "Tap to Autofill".
- `OtpInput.tsx`: 6 individual auto-advancing boxes with keyboard and paste handling.
- `PhoneAuthModal.tsx`: Country code dropdown, phone input, SMS dispatch, resend countdown.
- `ProfileSetupModal.tsx`: Name, username, and avatar selector for new users.

- [ ] **Step 3: Test and verify auth flow**
Run: `npm test tests/auth.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**
```bash
git add src/components/auth/ tests/auth.test.ts
git commit -m "feat: implement phone OTP authentication with simulated SMS banner"
```

---

### Task 5: WebRTC Dual-Camera Capture Component

**Files:**
- Create: `src/components/camera/DualCameraCapture.tsx`
- Create: `src/components/camera/BeRealCardPreview.tsx`
- Create: `src/data/sampleBiblePhotos.ts`

**Interfaces:**
- Produces: `<DualCameraCapture onPhotosCaptured={(startPhoto: string, endPhoto: string) => void} onCancel={() => void} />`
- Produces: `<BeRealCardPreview startPhoto={string} endPhoto={string} isInteractive={boolean} />`

- [ ] **Step 1: Create sample fallback Bible photos**
Prepare high quality base64/SVG vector photo presets in `src/data/sampleBiblePhotos.ts` so users without webcams or testing on desktop have instant one-click realistic verse images.

- [ ] **Step 2: Implement DualCameraCapture**
- Step 1: "Snap Starting Verse" $\rightarrow$ captures frame to canvas URL.
- Step 2: "Snap Ending Verse" $\rightarrow$ captures second frame.
- Includes camera flip button (front/rear), camera permission error guidance, file upload button, and preset sample button.

- [ ] **Step 3: Implement BeRealCardPreview with Tap-to-Swap**
Main card with picture-in-picture floating thumbnail. Clicking/tapping the thumbnail swaps the main and inset photos with animated transitions.

- [ ] **Step 4: Verify in browser and commit**
```bash
git add src/components/camera/ src/data/sampleBiblePhotos.ts
git commit -m "feat: implement dual-camera capture with BeReal tap-to-swap preview"
```

---

### Task 6: Bible Passage Selector & Post Creation Modal

**Files:**
- Create: `src/components/post/CreateReadingModal.tsx`
- Create: `src/components/post/PassageSelector.tsx`

**Interfaces:**
- Consumes: `DualCameraCapture`, `BIBLE_BOOKS`, `BibleRealDB.addPost`, `BibleRealDB.recordChaptersRead`
- Produces: `<CreateReadingModal isOpen={boolean} onClose={() => void} onPostCreated={(post: ReadingPost) => void} />`

- [ ] **Step 1: Implement PassageSelector**
Book dropdown with quick search, starting chapter/verse, ending chapter/verse, with automatic chapter count validation.

- [ ] **Step 2: Implement CreateReadingModal**
Combines DualCameraCapture flow, PassageSelector, duration counter, reflection note textarea, and BeReal final preview before publishing.
Upon publishing, marks completed chapters in the user's Bible progress and appends post to feed.

- [ ] **Step 3: Commit**
```bash
git add src/components/post/
git commit -m "feat: implement passage selector and complete reading post modal"
```

---

### Task 7: Friends Circle Feed & RealMoji Reactions

**Files:**
- Create: `src/components/feed/FeedView.tsx`
- Create: `src/components/feed/ReadingPostCard.tsx`
- Create: `src/components/feed/ReactionsBar.tsx`
- Create: `src/components/feed/CommentsDrawer.tsx`

**Interfaces:**
- Consumes: `BibleRealDB.getPosts`, `BibleRealDB.toggleReaction`, `BibleRealDB.addComment`
- Produces: `<FeedView onOpenCreatePost={() => void} />`

- [ ] **Step 1: Implement ReadingPostCard**
Header with friend avatar, username, Bible badge (e.g. *Romans 8:1–39*), time ago, BeReal interactive tap-to-swap dual photo, reflection text, and streak badge.

- [ ] **Step 2: Implement ReactionsBar & CommentsDrawer**
Support 5 reactions (🙏 Amen, ❤️ Love, 🔥 Fire, 💡 Inspired, 📖 Saved) with user toggle states and live counts. Comments sheet with instant reply submission.

- [ ] **Step 3: Commit**
```bash
git add src/components/feed/
git commit -m "feat: implement friends circle feed with reactions and comments"
```

---

### Task 8: Bible Reading Progress Dashboard

**Files:**
- Create: `src/components/progress/ProgressDashboard.tsx`
- Create: `src/components/progress/CircularProgress.tsx`
- Create: `src/components/progress/BookChapterMatrix.tsx`

**Interfaces:**
- Consumes: `calculateBibleProgress`, `BIBLE_BOOKS`, `BibleRealDB.getUserProgress`, `BibleRealDB.toggleChapter`
- Produces: `<ProgressDashboard />`

- [ ] **Step 1: Implement CircularProgress & stats overview**
Circular percentage ring (`X of 1,189 chapters`), OT/NT individual progression bars, and streak counter.

- [ ] **Step 2: Implement BookChapterMatrix**
Interactive list of all 66 books grouped by Testament. Tapping any book opens a grid of chapter buttons (e.g. Psalms 1-150) that can be inspected and manually toggled read/unread.

- [ ] **Step 3: Commit**
```bash
git add src/components/progress/
git commit -m "feat: implement Bible progress dashboard with interactive chapter matrix"
```

---

### Task 9: Real-Time Group Notification System & Demo Activity Simulator

**Files:**
- Create: `src/components/notifications/NotificationBanner.tsx`
- Create: `src/components/notifications/NotificationDrawer.tsx`
- Create: `src/services/friendSimulator.ts`

**Interfaces:**
- Consumes: `playNotificationChime`, `BibleRealDB.addNotification`, `BibleRealDB.addPost`
- Produces:
  - `<NotificationBanner />`: Slide-in top toast when any reading completes
  - `<NotificationDrawer />`: History of group alerts with mark-all-read
  - `simulateFriendReading(): void`: Helper function to trigger a friend completion notification on demand

- [ ] **Step 1: Implement notification toast and audio alert**
Slide-down toast banner with author avatar, verse completed message, and auto-dismiss + tap-to-navigate. Triggers pleasant audio chime.

- [ ] **Step 2: Implement friend simulator**
`simulateFriendReading()` simulates a group member (e.g. "David", "Sarah", or "Michael") completing a reading session, adding a post to the feed, and firing the group notification banner.

- [ ] **Step 3: Commit**
```bash
git add src/components/notifications/ src/services/friendSimulator.ts
git commit -m "feat: implement group notifications, chime sounds, and friend simulator"
```

---

### Task 10: App Shell, Mobile Frame Toggle & Verification

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/TopHeader.tsx`
- Create: `src/components/layout/PhoneMockupFrame.tsx`
- Create: `tests/e2e-flow.test.ts`

**Interfaces:**
- Integrates all components into a cohesive, responsive app with desktop frame toggle, bottom navigation, active tab routing, and automated integration tests.

- [ ] **Step 1: Write integration flow test**
Create `tests/e2e-flow.test.ts` verifying complete lifecycle: login $\rightarrow$ capture $\rightarrow$ post $\rightarrow$ feed update $\rightarrow$ progress update $\rightarrow$ group notification.

- [ ] **Step 2: Implement App navigation and phone frame**
Provide bottom bar (Feed, Capture, Progress, Alerts, Profile), top bar with streak flame and notification bell, and floating "Toggle Frame" button on desktop.

- [ ] **Step 3: Run all tests and build verification**
Run: `npm test && npm run build`
Expected: All tests pass, production bundle compiles cleanly.

- [ ] **Step 4: Launch local dev server and test live**
Start `npm run dev` and verify UI, camera, notifications, and Bible tracker.

- [ ] **Step 5: Final commit**
```bash
git add .
git commit -m "feat: complete BibleReal mobile-first application"
```
