'use client';

import LandingPage from '@/components/pages/LandingPage';
import type { ProfileData, LandingData } from '@/lib/admin/contentStore';

type HomeClientProps = {
  profile: ProfileData;
  landing: LandingData;
};

export default function HomeClient({ profile, landing }: HomeClientProps) {
  return (
    <main className="relative w-full font-mono">
      <section className="w-full relative z-10">
        <LandingPage name={profile.name} landing={landing} />
      </section>
    </main>
  );
}
