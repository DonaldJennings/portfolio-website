// components/organisms/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';
import TypingText from '@/components/atoms/TypingText';

interface HeroSectionProps {
  name: string;
  jobTitle: string;
  signature: string;
  photoUrl: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function HeroSection({
  name,
  jobTitle,
  signature,
  photoUrl,
  primaryCtaLabel = 'View My Work',
  secondaryCtaLabel = 'Get In Touch',
  secondaryCtaHref = '/contact',
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    /*
     * w-full only — no h-full. The parent (flex-1 wrapper in LandingPage) handles
     * centering this element vertically; this component sizes itself by its content.
     * flex-col on mobile (photo below text), flex-row on md+ (photo right of text).
     */
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-14 lg:gap-24 w-full px-5 sm:px-10 lg:px-20">

      {/* ── Text block — below photo on mobile (order-2), left on desktop ── */}
      <div
        className={`relative z-10 md:flex-1 max-w-lg w-full text-center md:text-left order-2 md:order-1 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Name */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-2">
          <span className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {name}
          </span>
        </h1>

        {/* Headline — typed */}
        <div className="font-mono text-sm sm:text-base text-slate-400 mb-1.5 min-h-[1.4rem]">
          <TypingText text={jobTitle} speed={32} />
        </div>

        {/* Credentials */}
        {signature && (
          <p className="font-mono text-xs text-slate-600 tracking-wide mb-4 sm:mb-6">
            {signature}
          </p>
        )}

        {/* CTA buttons */}
        <div
          className={`flex flex-row items-center gap-3 justify-center md:justify-start transition-all duration-700 ease-out delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => { window.location.href = '/about'; }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
            style={{ background: 'var(--accent-1)', color: 'var(--cta-text-color)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--cta-glow-shadow)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
          >
            {primaryCtaLabel}
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            onClick={() => { window.location.href = secondaryCtaHref; }}
            className="flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-400 border border-slate-700 bg-transparent transition-all duration-200 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800/40 active:scale-[0.97] whitespace-nowrap"
          >
            {secondaryCtaLabel}
          </button>
        </div>
      </div>

      {/* ── Photo — above text on mobile (order-1), right on desktop ── */}
      <div
        className={`relative z-10 flex-shrink-0 pb-3 order-1 md:order-2 transition-all duration-700 ease-out delay-200 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Soft glow behind photo */}
        <div
          className="absolute inset-0 rounded-full blur-3xl scale-110 pointer-events-none"
          style={{ background: 'var(--accent-1)', opacity: 0.12 }}
        />

        {/* Photo */}
        <div
          className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-64 xl:h-64 rounded-full overflow-hidden border border-white/10 transition-transform duration-500 hover:scale-[1.03] cursor-default"
          style={{ boxShadow: 'var(--hero-img-shadow)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={`${name} portrait`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status chip — pb-4 on parent gives this room to breathe */}
        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--accent-1)' }} />
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono tracking-wide">Available</span>
        </div>
      </div>
    </div>
  );
}
