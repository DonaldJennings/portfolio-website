import React from 'react';

type HeroImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

const HeroImage: React.FC<HeroImageProps> = ({ src, alt, className = '', style }) => (
  <picture>
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto block object-cover ${className}`}
      style={style}
    />
  </picture>
);

export default HeroImage;
