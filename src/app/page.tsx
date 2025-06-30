// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/organisms/HeroSection';

// dynamically load MatrixRain so it only runs in the browser
const MatrixRain = dynamic(() => import('@/components/organisms/MatrixRain'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-mono">
      {/* 1) Matrix-style rain background */}
      <MatrixRain />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      />

      {/* 3) Hero content + scroll cue */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <HeroSection
          name="Donald Jennings"
          summary="Software Engineer at Leonardo UK Ltd | MIET | BSc (Hons) Computer Science"
          photoUrl="/images/graduation-photo-inf-forum.jpg"
        />

        <div
          className="mt-8 animate-bounce text-green-400 text-3xl fade-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          ↓
        </div>
      </div>
    </main>
  );
}
