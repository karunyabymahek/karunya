import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/** Displays the original supplied logo artwork without recreating or cropping it. */
export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const widths = { sm: 150, md: 190, lg: 260, xl: 360 } as const;

  return (
    <img
      src="/karunya-logo-horizontal.jpg"
      alt="Karunya by Mahek"
      className={`block h-auto ${className}`}
      style={{
        width: widths[size],
        maxWidth: 'min(48vw, 190px)',
        objectFit: 'contain',
        objectPosition: 'center',
        flexShrink: 0,
      }}
    />
  );
};
