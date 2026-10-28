import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/** Brand lockup styled to match the supplied burgundy, ivory and rose reference. */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'burgundy',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizes = {
    sm: { width: 112, font: 31, subtitle: 7 },
    md: { width: 190, font: 52, subtitle: 10 },
    lg: { width: 300, font: 80, subtitle: 14 },
    xl: { width: 440, font: 118, subtitle: 18 },
  }[size];
  const ink = variant === 'monochrome' ? '#FFFFFF' : '#FFFFFF';

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: sizes.width, maxWidth: '100%', background: '#3A0927', padding: '4px 5px' }}
    >
      <svg viewBox="0 0 420 142" role="img" aria-label="Karunya by Mahek" className="w-full h-auto">
        <defs>
          <radialGradient id="karunya-reference-rose" cx="48%" cy="38%" r="68%">
            <stop offset="0%" stopColor="#B76578" />
            <stop offset="55%" stopColor="#91405A" />
            <stop offset="100%" stopColor="#67233F" />
          </radialGradient>
        </defs>
        <g transform="translate(278 63)" opacity="0.96">
          <path d="M-5 13C-39-8-26-39-8-43C8-47 23-30 16-13C35-36 55-24 51-5C48 12 29 19 8 25C32 38 23 60 6 60C-11 60-22 43-15 25C-36 42-54 21-43 3C-35-10-16-5-5 13Z" fill="url(#karunya-reference-rose)"/>
          <path d="M-9 9C-24-8-13-25 0-21C10-18 8-5 0 0C17-18 32-5 22 8C15 17 2 15-9 9Z" fill="#B96A7C"/>
          <path d="M-2 8C-5-1 4-11 11-6C16-2 8 7-2 8Z" fill="#874056"/>
        </g>
        <text x="4" y="86" fill={ink} fontFamily="'Bodoni 72', Didot, 'Times New Roman', serif" fontSize={sizes.font} fontWeight="700" letterSpacing="-3">Karunya</text>
        {showSubtitle && <text x="210" y="122" textAnchor="middle" fill={ink} fontFamily="Didot, 'Times New Roman', serif" fontSize={sizes.subtitle} letterSpacing="8">By Mahek</text>}
      </svg>
    </div>
  );
};
