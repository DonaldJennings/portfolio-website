// app/page.tsx
'use client';

import LandingPage from '@/components/pages/LandingPage';
export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-900 font-mono">
      <LandingPage />
    </main>
  );
}
