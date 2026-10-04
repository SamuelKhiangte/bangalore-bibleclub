import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface BeRealCardPreviewProps {
  startPhoto: string;
  endPhoto: string;
  isInteractive?: boolean;
  startLabel?: string;
  endLabel?: string;
  aspectRatio?: string;
}

export const BeRealCardPreview: React.FC<BeRealCardPreviewProps> = ({
  startPhoto,
  endPhoto,
  isInteractive = true,
  startLabel = 'Start Verse',
  endLabel = 'End Verse',
  aspectRatio = '4 / 5'
}) => {
  const [isSwapped, setIsSwapped] = useState(false);

  const mainPhoto = isSwapped ? endPhoto : startPhoto;
  const insetPhoto = isSwapped ? startPhoto : endPhoto;
  const mainLabel = isSwapped ? endLabel : startLabel;
  const insetLabel = isSwapped ? startLabel : endLabel;

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive) {
      setIsSwapped((prev) => !prev);
    }
  };

  return (
    <div
      className="bereal-card"
      style={{
        aspectRatio,
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(60, 45, 30, 0.12), 0 0 0 1px rgba(184, 168, 146, 0.3)',
        backgroundColor: '#EAE3D5'
      }}
    >
      {/* Main Full Photo */}
      <img
        src={mainPhoto}
        alt={mainLabel}
        className="bereal-main-photo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      {/* Main Photo Label Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(39, 34, 30, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 800,
          color: isSwapped ? '#A7F3D0' : '#FDE68A',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontFamily: 'var(--font-display)'
        }}
      >
        <span>{mainLabel}</span>
      </div>

      {/* Picture-in-Picture Inset Floating Photo */}
      <div
        className="bereal-inset-photo-container"
        onClick={handleSwap}
        title={isInteractive ? 'Tap to swap views' : undefined}
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '28%',
          aspectRatio: '3 / 4',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '2px solid #FFFFFF',
          boxShadow: '0 8px 24px rgba(60, 45, 30, 0.25)',
          cursor: isInteractive ? 'pointer' : 'default',
          zIndex: 15
        }}
      >
        <img
          src={insetPhoto}
          alt={insetLabel}
          className="bereal-inset-photo"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Small Swap Icon Indicator */}
        {isInteractive && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'rgba(30, 25, 20, 0.7)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <RefreshCw size={10} />
          </div>
        )}

        <div className="bereal-tag-badge">
          {insetLabel}
        </div>
      </div>
    </div>
  );
};
