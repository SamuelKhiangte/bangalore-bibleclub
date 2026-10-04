/**
 * High quality SVG Data URLs representing Bible reading photos
 * (Start verse page & End verse page / reader perspective)
 */

function createBibleSvg(verseRef: string, verseText: string, label: string, accentColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141C2B"/>
        <stop offset="50%" stop-color="#0E1422"/>
        <stop offset="100%" stop-color="#080C14"/>
      </linearGradient>
      <linearGradient id="page" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F5EFE6"/>
        <stop offset="48%" stop-color="#FFFDF9"/>
        <stop offset="50%" stop-color="#E8DEC8"/>
        <stop offset="52%" stop-color="#FFFDF9"/>
        <stop offset="100%" stop-color="#F5EFE6"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <!-- Background Desk / Table surface -->
    <rect width="600" height="750" fill="url(#bg)"/>

    <!-- Subtle warm glow from study lamp -->
    <circle cx="300" cy="150" r="320" fill="${accentColor}" opacity="0.12"/>

    <!-- Open Bible Book -->
    <g filter="url(#shadow)" transform="translate(45, 110)">
      <!-- Leather Cover Rim -->
      <rect x="0" y="0" width="510" height="530" rx="14" fill="#3D2714"/>
      <rect x="5" y="5" width="500" height="520" rx="10" fill="#241408"/>
      
      <!-- Open Pages -->
      <rect x="15" y="15" width="480" height="500" rx="6" fill="url(#page)"/>

      <!-- Center book crease line -->
      <line x1="255" y1="15" x2="255" y2="515" stroke="#C5B69C" stroke-width="2"/>

      <!-- Column Text Lines - Left Page -->
      <g fill="#2C241E" opacity="0.75" transform="translate(35, 45)">
        <!-- Header -->
        <text x="0" y="10" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#786650">${verseRef.split(' ')[0]}</text>
        <line x1="0" y1="16" x2="190" y2="16" stroke="#D1C3AD" stroke-width="1"/>
        
        <!-- Text lines -->
        <rect x="0" y="30" width="185" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="42" width="170" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="54" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="66" width="180" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="78" width="140" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>

        <rect x="0" y="100" width="185" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="112" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="124" width="160" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        
        <!-- Verse Highlight Area -->
        <rect x="-4" y="145" width="198" height="60" rx="4" fill="${accentColor}" opacity="0.25"/>
        <text x="0" y="165" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#1A1208">📖 ${verseRef}</text>
        <rect x="0" y="175" width="180" height="4" rx="2" fill="#1A1208"/>
        <rect x="0" y="187" width="150" height="4" rx="2" fill="#1A1208"/>

        <rect x="0" y="220" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="232" width="185" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="244" width="175" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="256" width="180" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="268" width="130" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
      </g>

      <!-- Right Page -->
      <g fill="#2C241E" opacity="0.75" transform="translate(285, 45)">
        <text x="130" y="10" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#786650">${label}</text>
        <line x1="0" y1="16" x2="190" y2="16" stroke="#D1C3AD" stroke-width="1"/>
        <rect x="0" y="30" width="180" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="42" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="54" width="165" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="66" width="185" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="78" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="90" width="140" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>

        <rect x="0" y="115" width="185" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="127" width="175" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="139" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="151" width="160" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>

        <rect x="0" y="180" width="190" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="192" width="180" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
        <rect x="0" y="204" width="170" height="4" rx="2" fill="#6A5A4A" opacity="0.6"/>
      </g>
    </g>

    <!-- Overlay Caption Banner -->
    <rect x="35" y="32" width="530" height="60" rx="16" fill="rgba(16, 23, 38, 0.85)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <circle cx="65" cy="62" r="16" fill="${accentColor}"/>
    <text x="65" y="67" font-family="'Inter', sans-serif" font-size="14" font-weight="bold" fill="#000" text-anchor="middle">✝</text>
    <text x="96" y="55" font-family="'Outfit', sans-serif" font-size="16" font-weight="bold" fill="#F8FAFC">${verseRef}</text>
    <text x="96" y="73" font-family="'Inter', sans-serif" font-size="12" fill="#94A3B8">${label} • "${verseText.slice(0, 36)}..."</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_START_PHOTO = createBibleSvg(
  'Hebrews 11:1',
  'Now faith is the assurance of things hoped for',
  'START VERSE PHOTO',
  '#F59E0B'
);

export const SAMPLE_END_PHOTO = createBibleSvg(
  'Hebrews 11:40',
  'God had provided something better for us',
  'END VERSE PHOTO',
  '#10B981'
);

export const SAMPLE_JOHN_START = createBibleSvg(
  'John 1:1',
  'In the beginning was the Word, and the Word was with God',
  'START VERSE PHOTO',
  '#38BDF8'
);

export const SAMPLE_JOHN_END = createBibleSvg(
  'John 1:18',
  'No one has seen God at any time. The only begotten Son...',
  'END VERSE PHOTO',
  '#A855F7'
);
