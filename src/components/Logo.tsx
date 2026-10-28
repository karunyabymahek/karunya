import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'burgundy' | 'cream' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/** Displays the original supplied logo artwork without recreating or altering it. */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const widths = { sm: 112, md: 190, lg: 300, xl: 440 };
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: widths[size],
        maxWidth: '100%',
        aspectRatio: '3 / 1',
        background: '#3A0927',
      }}
    >
      <img
        src="/karunya-logo.webp"
        alt="Karunya by Mahek — original logo"
        className="block w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
      />
    </div>
  );
};
