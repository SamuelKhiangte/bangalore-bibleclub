import { useState, useEffect } from 'react';
import { TopHeader } from './components/layout/TopHeader.tsx';
import { BottomNav } from './components/layout/BottomNav.tsx';
import { FeedView } from './components/feed/FeedView.tsx';
import { VerseQAView } from './components/qa/VerseQAView.tsx';
import { ProgressDashboard } from './components/progress/ProgressDashboard.tsx';
import { NotificationDrawer } from './components/notifications/NotificationDrawer.tsx';
import { NotificationBanner } from './components/notifications/NotificationBanner.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';
import { PhoneAuthModal } from './components/auth/PhoneAuthModal.tsx';
import { CreateReadingModal } from './components/post/CreateReadingModal.tsx';
import { PwaInstallPromptModal } from './components/pwa/PwaInstallPromptModal.tsx';
import { BibleRealDB } from './services/storage.ts';
import type { UserProfile, ActiveTab, GroupNotification, ReadingPost } from './types/index.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => BibleRealDB.getUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [circleSubTab, setCircleSubTab] = useState<'snaps' | 'qa'>('snaps');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<GroupNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const refreshUnread = () => {
    setUnreadCount(BibleRealDB.getUnreadNotificationsCount());
  };

  useEffect(() => {
    refreshUnread();
    const unsub = BibleRealDB.subscribe(() => {
      refreshUnread();
      if (currentUser) {
        const updated = BibleRealDB.getUser();
        if (updated) setCurrentUser(updated);
      }
    });
    return unsub;
  }, [currentUser]);

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
    setCircleSubTab('snaps');
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
                onOpenInstall={() => setIsInstallModalOpen(true)}
              />

              {/* Sub-tab Pill Switcher for Circle View (Snaps vs Verse Q&A) */}
              {activeTab === 'feed' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '8px 16px 2px',
                    backgroundColor: 'var(--bg-app)',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      padding: '3px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 8px rgba(60, 45, 30, 0.04)'
                    }}
                  >
                    <button
                      onClick={() => setCircleSubTab('snaps')}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: circleSubTab === 'snaps' ? 'var(--accent-gold)' : 'transparent',
                        color: circleSubTab === 'snaps' ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      📸 Reading Snaps
                    </button>
                    <button
                      onClick={() => setCircleSubTab('qa')}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: circleSubTab === 'qa' ? 'var(--accent-gold)' : 'transparent',
                        color: circleSubTab === 'qa' ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      💬 Verse Q&A
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <main className="app-content-scroll">
                {activeTab === 'feed' && circleSubTab === 'snaps' && (
                  <FeedView
                    currentUser={currentUser}
                    onOpenCreatePost={() => setIsCaptureModalOpen(true)}
                  />
                )}

                {activeTab === 'feed' && circleSubTab === 'qa' && (
                  <VerseQAView currentUser={currentUser} />
                )}

                {activeTab === 'qa' && (
                  <VerseQAView currentUser={currentUser} />
                )}

                {activeTab === 'progress' && (
                  <ProgressDashboard currentUser={currentUser} />
                )}

                {activeTab === 'notifications' && (
                  <NotificationDrawer
                    onSelectPost={() => {
                      setCircleSubTab('snaps');
                      setActiveTab('feed');
                    }}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileView
                    user={currentUser}
                    onLogout={handleLogout}
                    onOpenInstall={() => setIsInstallModalOpen(true)}
                  />
                )}
              </main>

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                  if (tab === 'feed') setCircleSubTab('snaps');
                  setActiveTab(tab);
                }}
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

              {/* PWA Mobile Add to Home Screen Prompt Modal */}
              <PwaInstallPromptModal
                isOpen={isInstallModalOpen}
                onClose={() => setIsInstallModalOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
