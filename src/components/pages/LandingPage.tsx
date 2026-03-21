'use client';

import Link from 'next/link';
import HeroSection from '@/components/organisms/HeroSection';
import type { LandingData } from '@/lib/admin/contentStore';

interface LandingPageProps {
  name: string;
  landing: LandingData;
}

// SVG icons for known routes; falls back to the stored emoji
const NAV_ICONS: Record<string, React.ReactNode> = {
  '/blog': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  '/projects': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  '/contact': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  '/about': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

export default function LandingPage({ name, landing }: LandingPageProps) {
  const hasCards = landing.navLinks.length > 0;

  return (
    /*
     * landing-height handles viewport fill:
     *   mobile  → min-height so content can scroll if needed, overflow visible
     *   desktop → exact height, overflow hidden, cards pin to bottom
     * flex-col: hero (flex-1) grows to fill space, cards (flex-shrink-0) at bottom.
     */
    <div
      className="landing-height relative flex flex-col w-full"
      style={{ marginTop: '80px' }}
    >
      {/* Ambient glow blobs — purely decorative */}
      <div
        className="absolute -top-48 -left-24 w-[560px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'var(--accent-1)', opacity: 0.055, filter: 'blur(130px)' }}
      />
      <div
        className="absolute -bottom-32 -right-24 w-[460px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'var(--accent-2)', opacity: 0.04, filter: 'blur(110px)' }}
      />

      {/* ── Hero content ── */}
      {/*
       * items-end + pb: anchors hero content to the bottom of the available space
       * so it sits directly above the nav cards with no dead zone between them.
       * pt-16 keeps breathing room below the navbar at the top.
       */}
      <div className="flex-1 flex items-center justify-center min-h-0 py-8 md:py-0">
        <HeroSection
          name={name}
          jobTitle={landing.headline}
          signature={landing.subheadline}
          photoUrl={landing.heroPhotoUrl}
          primaryCtaLabel={landing.primaryCtaLabel}
          secondaryCtaLabel={landing.secondaryCtaLabel}
          secondaryCtaHref={landing.secondaryCtaHref}
        />
      </div>

      {/* ── Nav link cards ── */}
      {hasCards && (
        <div className="flex-shrink-0 pb-2 sm:pb-3 px-4 sm:px-10 lg:px-20 relative z-10">
          {/* 2-col grid on mobile, row on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {landing.navLinks.map(link => {
              const icon = NAV_ICONS[link.href];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
                  style={{
                    background: 'rgba(var(--surface-base-rgb), 0.72)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'var(--card-border)',
                    boxShadow: 'var(--card-shadow)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'var(--card-border-hover)';
                    el.style.boxShadow = 'var(--card-shadow-hover)';
                    el.style.background = 'rgba(var(--surface-elevated-rgb), 0.82)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'var(--card-border)';
                    el.style.boxShadow = 'var(--card-shadow)';
                    el.style.background = 'rgba(var(--surface-base-rgb), 0.72)';
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'var(--accent-bg)',
                      color: icon ? 'var(--accent-1)' : undefined,
                    }}
                  >
                    {icon ?? <span className="text-sm leading-none">{link.icon}</span>}
                  </div>

                  {/* Label + description */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] sm:text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
                      {link.label}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-600 group-hover:text-slate-500 transition-colors truncate mt-0.5 font-mono hidden sm:block">
                      {link.description}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: 'var(--accent-1)', opacity: 0.5 }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
