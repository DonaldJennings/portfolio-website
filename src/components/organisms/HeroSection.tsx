// components/organisms/HeroSection.tsx
'use client';

import React from 'react';
import HeroImage from '@/components/atoms/HeroImage';
import TypingText from '@/components/atoms/TypingText';

interface HeroSectionProps {
  name: string;
  summary: string;
  photoUrl: string;
}

export default function HeroSection({ name, summary, photoUrl }: HeroSectionProps) {
  return (
    <section className="relative flex flex-wrap items-center justify-between gap-8 px-4 py-12">
      <div className="flex-1 min-w-0 max-w-xl text-left z-10">
        <h1 className="text-4xl font-bold m-0 text-white">{name}</h1>
        <div className="text-lg mt-4 leading-relaxed text-gray-300">
          <TypingText text={summary} speed={50} />
        </div>
      </div>

      <div className="flex-shrink-0 z-10">
        {/* Framed portrait with dimmed filter and subtle tilt on hover */}
        <div
          className="
            w-60 h-60
            rounded-md
            overflow-hidden
            border-4 border-green-500
            shadow-2xl
            filter brightness-75
            transform transition duration-500
            hover:scale-105 hover:rotate-3
          "
        >
          <HeroImage
            src={photoUrl}
            alt={`${name} portrait`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
