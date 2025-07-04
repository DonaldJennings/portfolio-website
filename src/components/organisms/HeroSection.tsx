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
    <section className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-10 px-6 sm:px-10 lg:px-20 py-20">
      {/* Text block */}
      <div className="w-full md:flex-1 max-w-2xl text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-sky-400 mb-4">{name}</h1>
        <div className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-6">
          <TypingText text={summary} speed={50} />
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-center md:justify-end">
        <div
          className="
        w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60
        max-w-full
        rounded-md overflow-hidden
        border-2 sm:border-4 border-white
        shadow-[0_0_12px_rgba(59,130,246,0.4)]
        filter brightness-90
        transition-transform duration-300
        hover:scale-105 hover:rotate-2
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
