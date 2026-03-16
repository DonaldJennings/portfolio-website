import React from 'react';
import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt }) => (
  <div
    className="hidden md:flex items-center justify-center"
    style={{ minWidth: '120px', width: '140px', height: '100px' }}
  >
    <div
      className="relative w-[130px] h-[90px]"
      style={{
        position: 'relative',
        width: '130px',
        height: '90px',
        aspectRatio: '130 / 90',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 220px"
        className="rounded-2xl object-cover shadow-xl border-2 border-blue-400"
        style={{ background: '#222' }}
      />
    </div>
  </div>
);

export default CardImage;
