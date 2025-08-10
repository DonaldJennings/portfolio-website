import React from 'react';
import Image from 'next/image';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = 'Avatar', size = 32 }: AvatarProps) {
  return (
    <Image
      src={src || '/default-avatar.png'}
      alt={alt}
      width={Number(size)}
      height={Number(size)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
