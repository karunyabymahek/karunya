import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/**
 * Uses Mahek's supplied original logo artwork (not a recreated text/flower mark).
 * The artwork has generous surrounding whitespace, so the image is cropped
 * to a horizontal header lockup while keeping the original artwork unchanged.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const widths = { sm: 150, md: 190, lg: 260, xl: 360 } as const;
  return (
    <span
      className={`inline-flex overflow-hidden ${className}`}
      style={{
        width: widths[size],
        maxWidth: 'min(48vw, 190px)',
        aspectRatio: '3.2 / 1',
        flexShrink: 1,
        backgroundColor: '#3A0927',
      }}
    >
      <img
        src="/karunya-original-logo.jpg"
        alt="Karunya by Mahek"
        className="block h-full w-full"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
      />
    </span>
  );
};
