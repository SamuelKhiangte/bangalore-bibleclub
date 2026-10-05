import React from 'react';

interface BotanicalArtProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Botanical line art inspired by the chamomile & wildflower illustration
 * in the editorial reference design.
 */
export const BotanicalArt: React.FC<BotanicalArtProps> = ({
  width = 80,
  height = 120,
  color = 'var(--accent-gold-light)',
  className,
  style
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', ...style }}
    >
      {/* Main central stem */}
      <path
        d="M60 175 C58 135, 52 95, 62 48"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Side branch right */}
      <path
        d="M58 120 C72 105, 88 88, 92 65"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Side branch left */}
      <path
        d="M56 142 C40 128, 30 112, 34 85"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Primary Flower (Top Center) */}
      <circle cx="63" cy="45" r="7" stroke={color} strokeWidth="1.3" strokeDasharray="2 1.5" />
      {/* Flower Petals */}
      <path d="M63 38 C63 26, 60 22, 63 20 C66 22, 65 26, 65 38" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M68 40 C78 32, 82 30, 84 32 C83 35, 79 38, 70 42" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M70 47 C82 48, 86 51, 86 53 C84 55, 80 54, 70 49" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M68 52 C76 60, 78 64, 76 66 C73 66, 70 61, 65 53" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M61 52 C56 63, 53 67, 50 66 C49 63, 52 58, 58 51" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M56 46 C44 46, 40 43, 40 40 C42 38, 46 41, 56 43" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M57 41 C50 32, 47 28, 49 26 C52 26, 55 30, 59 39" stroke={color} strokeWidth="1.2" strokeLinecap="round" />

      {/* Secondary Flower (Right branch) */}
      <circle cx="92" cy="63" r="5" stroke={color} strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <path d="M92 58 C95 48, 98 44, 100 45 C100 48, 97 53, 94 58" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M96 61 C105 58, 109 58, 110 60 C109 62, 104 63, 97 64" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M96 66 C104 71, 107 74, 106 76 C103 76, 99 73, 95 68" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M89 67 C86 74, 83 77, 81 76 C80 74, 83 69, 88 66" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M87 61 C80 58, 77 55, 78 54 C81 54, 84 57, 88 60" stroke={color} strokeWidth="1.1" strokeLinecap="round" />

      {/* Flower bud (Left branch) */}
      <path d="M34 85 C32 78, 30 73, 31 71 C34 71, 36 76, 36 84" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="33" cy="74" r="3.5" stroke={color} strokeWidth="1.1" strokeDasharray="1.5 1" />

      {/* Delicate feathery leaves */}
      <path d="M60 150 C70 146, 78 147, 82 143 C80 140, 72 141, 59 146" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M68 144 C72 138, 77 136, 79 137" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M72 145 C77 149, 81 150, 83 148" stroke={color} strokeWidth="0.9" strokeLinecap="round" />

      <path d="M57 160 C46 156, 38 158, 34 154 C36 151, 44 151, 56 156" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M48 154 C44 148, 39 147, 37 148" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M44 156 C39 160, 35 161, 34 159" stroke={color} strokeWidth="0.9" strokeLinecap="round" />

      <path d="M59 132 C50 124, 43 124, 40 121 C42 118, 49 120, 58 128" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M60 105 C70 98, 77 98, 80 95 C78 92, 71 94, 61 102" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
};
