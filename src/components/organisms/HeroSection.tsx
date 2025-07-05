// components/organisms/HeroSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import HeroImage from '@/components/atoms/HeroImage';
import TypingText from '@/components/atoms/TypingText';

interface HeroSectionProps {
  name: string;
  summary: string;
  photoUrl: string;
}

export default function HeroSection({ name, summary, photoUrl }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-10 px-4 sm:px-6 lg:px-20 relative overflow-hidden"
      style={{
        height: 'calc(100vh - 80px)',
        marginTop: '80px',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-green-400/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-purple-400/30 rounded-full animate-float-fast"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-cyan-400/20 rounded-full animate-float-slow delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-blue-500/15 rounded-full animate-float-medium delay-500"></div>

        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Text block */}
      <div
        className={`w-full md:flex-1 max-w-2xl text-center md:text-left relative z-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Glowing name with staggered letter animation */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 relative">
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
            {name}
          </span>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-cyan-400/20 blur-lg -z-10 animate-pulse-gentle"></div>
        </h1>

        {/* Enhanced typing text with better styling */}
        <div className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-6 relative">
          <TypingText text={summary} speed={40} />
          {/* Subtle text glow */}
          <div className="absolute inset-0 text-gray-300/30 blur-sm pointer-events-none">
            <TypingText text={summary} speed={40} />
          </div>
        </div>

        {/* Call-to-action buttons with hover effects */}
        <div
          className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:from-blue-500 hover:to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              View My Work
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
          <button
            onClick={() => {
              window.location.href = '/contact';
            }}
            className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/10 transform active:scale-95 backdrop-blur-sm"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Enhanced image section */}
      <div
        className={`w-full md:w-auto flex justify-center md:justify-end relative transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 rotate-3'
        }`}
      >
        {/* Animated ring around image */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin-slow scale-110"></div>
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-reverse scale-125"></div>

        <div className="relative group">
          <div
            className="
            w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60
            max-w-full
            rounded-full overflow-hidden
            border-3 sm:border-4 border-white/80
            shadow-[0_0_15px_rgba(59,130,246,0.4),0_0_30px_rgba(59,130,246,0.2)]
            filter brightness-90
            transition-all duration-500 ease-out
            hover:scale-110 hover:rotate-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.6),0_0_50px_rgba(59,130,246,0.3)]
            relative z-10
          "
          >
            <HeroImage
              src={photoUrl}
              alt={`${name} portrait`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Floating status indicator */}
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-4 border-slate-900 animate-pulse z-20">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
