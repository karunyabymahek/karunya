import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/**
 * Temporary visible brand lockup. The linked image asset was blank in production,
 * so render the wordmark directly rather than showing an empty rectangle.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'burgundy',
  size = 'md',
  showSubtitle = true,
}) => {
  const dimensions = {
    sm: { width: 112, word: 22, subtitle: 5.5 },
    md: { width: 190, word: 38, subtitle: 8 },
    lg: { width: 300, word: 59, subtitle: 12 },
    xl: { width: 440, word: 86, subtitle: 16 },
  }[size];
  const ink = variant === 'cream' ? '#F5EFE9' : '#FFFFFF';
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: dimensions.width,
        maxWidth: '100%',
        background: '#3A0927',
        aspectRatio: '3 / 1',
      }}
    >
      <svg viewBox="0 0 420 140" role="img" aria-label="Karunya by Mahek" className="block w-full h-full">
        <defs>
          <radialGradient id="karunya-rose" cx="48%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#C47A8B" />
            <stop offset="58%" stopColor="#98445F" />
            <stop offset="100%" stopColor="#67213F" />
          </radialGradient>
        </defs>
        <g transform="translate(281 64)" opacity="0.98">
          <path d="M-8 12C-38-7-28-38-8-43C7-47 22-30 16-13C34-35 55-24 51-5C48 12 28 19 8 25C32 38 23 60 6 60C-11 60-22 43-15 25C-36 42-54 21-43 3C-35-10-16-5-8 12Z" fill="url(#karunya-rose)"/>
          <path d="M-9 9C-24-8-13-25 0-21C10-18 8-5 0 0C17-18 32-5 22 8C15 17 2 15-9 9Z" fill="#B96A7C"/>
          <path d="M-2 8C-5-1 4-11 11-6C16-2 8 7-2 8Z" fill="#874056"/>
        </g>
        <text x="5" y="85" fill={ink} fontFamily="'Bodoni 72', Didot, 'Times New Roman', serif" fontSize={dimensions.word} fontWeight="700" letterSpacing="-1.8">Karunya</text>
        {showSubtitle && <text x="210" y="119" textAnchor="middle" fill={ink} fontFamily="Didot, 'Times New Roman', serif" fontSize={dimensions.subtitle} letterSpacing="7">By Mahek</text>}
      </svg>
    </div>
  );
};
