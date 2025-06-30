// components/atoms/HeroImage.tsx
import React from 'react';

export interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroImage({ src, alt, className = '', style }: HeroImageProps) {
  return (
    <picture>
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-auto block object-cover rounded-md shadow-lg
          ${className}
        `}
        style={style}
      />
    </picture>
  );
}
