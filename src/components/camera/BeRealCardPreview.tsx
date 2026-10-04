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
  // isSwapped: false means startPhoto is main and endPhoto is inset.
  // true means endPhoto is main and startPhoto is inset.
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
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backgroundColor: '#0A0F1D'
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
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 700,
          color: isSwapped ? 'var(--accent-emerald)' : 'var(--accent-gold)',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
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
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75)',
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
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
