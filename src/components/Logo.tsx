import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'burgundy',
  size = 'md',
  showSubtitle = true,
}) => {
  const isLight = variant === 'cream';

  const titleSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl md:text-3xl tracking-tight',
    lg: 'text-4xl md:text-5xl tracking-tight',
    xl: 'text-5xl md:text-6xl tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] md:text-[11px] tracking-[0.28em]',
    lg: 'text-[12px] md:text-[13px] tracking-[0.32em]',
    xl: 'text-[14px] md:text-[15px] tracking-[0.35em]',
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Decorative Atelier Rose Motif positioned softly behind typography */}
      <div
        className="absolute pointer-events-none -top-1.5 md:-top-2.5 opacity-25"
        style={{
          width: size === 'xl' ? '90px' : size === 'lg' ? '70px' : size === 'md' ? '48px' : '36px',
          height: size === 'xl' ? '90px' : size === 'lg' ? '70px' : size === 'md' ? '48px' : '36px',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLight ? 'text-[#F5EFE9]' : 'text-[#C48A8C]'}
        >
          {/* Handcrafted Rose Silhouette */}
          <path
            d="M50 20C42 20 38 27 38 33C38 41 46 45 50 49C54 45 62 41 62 33C62 27 58 20 50 20Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <path
            d="M36 34C28 35 22 42 24 50C26 58 35 62 43 64C41 57 41 50 42 45C39 42 37 38 36 34Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
          <path
            d="M64 34C72 35 78 42 76 50C74 58 65 62 57 64C59 57 59 50 58 45C61 42 63 38 64 34Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
          <path
            d="M50 51C44 54 36 61 38 72C40 82 50 85 50 85C50 85 60 82 62 72C64 61 56 54 50 51Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <circle cx="50" cy="42" r="5" fill="currentColor" />
        </svg>
      </div>

      {/* Main Brand Wordmark */}
      <span
        className={`font-editorial font-medium uppercase relative z-10 transition-colors duration-300 ${
          isLight ? 'text-[#F5EFE9]' : 'text-[#5A0F26]'
        } ${titleSizes[size]}`}
        style={{ letterSpacing: '0.04em' }}
      >
        Karunya
      </span>

      {/* Subtitle "by Mahek" */}
      {showSubtitle && (
        <span
          className={`font-sans font-light uppercase mt-0.5 relative z-10 ${
            isLight ? 'text-[#F5EFE9]/80' : 'text-[#5A0F26]/75'
          } ${subtitleSizes[size]}`}
        >
          by Mahek
        </span>
      )}
    </div>
  );
};
