import React from 'react';
import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt }) => (
  <div
    className="flex items-center justify-center"
    style={{ minWidth: '180px', width: '240px', height: '180px' }}
  >
    <div
      className="relative w-[220px] h-[160px]"
      style={{
        position: 'relative',
        width: '220px',
        height: '160px',
        aspectRatio: '220 / 160',
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
