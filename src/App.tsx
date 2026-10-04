import React, { useState } from 'react';

export default function App() {
  const [isFullWidth, setIsFullWidth] = useState(false);

  return (
    <div className={`desktop-viewport ${isFullWidth ? 'full-width' : ''}`}>
      <button 
        className="viewport-mode-toggle"
        onClick={() => setIsFullWidth(!isFullWidth)}
        title="Toggle phone frame on desktop"
      >
        <span>📱</span>
        <span>{isFullWidth ? 'Phone Frame' : 'Full Width'}</span>
      </button>

      <div className="phone-frame">
        <div className="phone-notch-bar">
          <span>9:41</span>
          <div className="phone-island">
            <div className="phone-island-lens"></div>
          </div>
          <span>5G 􀛨</span>
        </div>

        <div className="app-screen">
          <div className="app-content-scroll" style={{ padding: '24px', textAlign: 'center' }}>
            <h1 className="text-gold-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '26px' }}>
              BibleReal
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your daily Bible reading journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
