import { useState, useEffect } from 'react';
import { TopHeader } from './components/layout/TopHeader.tsx';
import { BottomNav } from './components/layout/BottomNav.tsx';
import { FeedView } from './components/feed/FeedView.tsx';
import { ProgressDashboard } from './components/progress/ProgressDashboard.tsx';
import { NotificationDrawer } from './components/notifications/NotificationDrawer.tsx';
import { NotificationBanner } from './components/notifications/NotificationBanner.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';
import { PhoneAuthModal } from './components/auth/PhoneAuthModal.tsx';
import { CreateReadingModal } from './components/post/CreateReadingModal.tsx';
import { BibleRealDB } from './services/storage.ts';
import { simulateFriendReading } from './services/friendSimulator.ts';
import type { UserProfile, ActiveTab, GroupNotification, ReadingPost } from './types/index.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => BibleRealDB.getUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<GroupNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Sync unread notification count
  const refreshUnread = () => {
    setUnreadCount(BibleRealDB.getUnreadNotificationsCount());
  };

  useEffect(() => {
    refreshUnread();
    const unsub = BibleRealDB.subscribe(() => {
      refreshUnread();
      if (currentUser) {
        // sync user profile updates
        const updated = BibleRealDB.getUser();
        if (updated) setCurrentUser(updated);
      }
    });
    return unsub;
  }, [currentUser]);

  const handleSimulateReading = () => {
    const notif = simulateFriendReading();
    setActiveNotification(notif);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    BibleRealDB.setUser(user);
    setCurrentUser(user);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    BibleRealDB.setUser(null);
    setCurrentUser(null);
  };

  const handlePostCreated = (post: ReadingPost) => {
    // Show self notification
    setActiveNotification({
      id: `notif-self-${Date.now()}`,
      type: 'reading_completed',
      actorName: currentUser?.name || 'You',
      actorAvatar: currentUser?.avatarUrl || '',
      title: 'Reading Completed',
      message: `You completed ${post.bookName} ${post.startChapter}:${post.startVerse}–${post.endVerse}!`,
      timestamp: new Date().toISOString(),
      read: false
    });
    setActiveTab('feed');
  };

  return (
    <div className={`desktop-viewport ${isFullWidth ? 'full-width' : ''}`}>
      {/* Desktop Mode Toggle Button */}
      <button
        className="viewport-mode-toggle"
        onClick={() => setIsFullWidth(!isFullWidth)}
        title="Toggle phone frame on desktop"
      >
        <span>📱</span>
        <span>{isFullWidth ? 'Phone Frame' : 'Full Width'}</span>
      </button>

      {/* Main Container / Phone Mockup Frame */}
      <div className="phone-frame">
        {/* Dynamic Island / Notch */}
        <div className="phone-notch-bar">
          <span>9:41</span>
          <div className="phone-island">
            <div className="phone-island-lens"></div>
          </div>
          <span>5G 􀛨</span>
        </div>

        {/* Real-time Notification Banner */}
        <NotificationBanner
          notification={activeNotification}
          onDismiss={() => setActiveNotification(null)}
          onClick={() => {
            setActiveNotification(null);
            setActiveTab('feed');
          }}
        />

        <div className="app-screen">
          {!currentUser ? (
            <PhoneAuthModal onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {/* Top Sticky Header */}
              <TopHeader
                currentUser={currentUser}
                activeTab={activeTab}
                unreadCount={unreadCount}
                onTabChange={setActiveTab}
                onSimulateReading={handleSimulateReading}
              />

              {/* Main Content Area */}
              <main className="app-content-scroll">
                {activeTab === 'feed' && (
                  <FeedView
                    currentUser={currentUser}
                    onOpenCreatePost={() => setIsCaptureModalOpen(true)}
                  />
                )}

                {activeTab === 'progress' && (
                  <ProgressDashboard currentUser={currentUser} />
                )}

                {activeTab === 'notifications' && (
                  <NotificationDrawer
                    onSelectPost={() => setActiveTab('feed')}
                    onTriggerSimulation={handleSimulateReading}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileView user={currentUser} onLogout={handleLogout} />
                )}
              </main>

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onOpenCapture={() => setIsCaptureModalOpen(true)}
                unreadCount={unreadCount}
              />

              {/* Create Reading Modal (Dual-Camera Capture + Passage selector) */}
              <CreateReadingModal
                user={currentUser}
                isOpen={isCaptureModalOpen}
                onClose={() => setIsCaptureModalOpen(false)}
                onPostCreated={handlePostCreated}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
