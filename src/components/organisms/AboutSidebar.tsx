import React from 'react';
import SkillsSection from '@/components/organisms/SkillsSection';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import InterestsSection from '@/components/organisms/InterestsSection';
import AwardsSection from '@/components/organisms/AwardsSection';

export default function AboutSidebar() {
  return (
    <div className="space-y-8">
      <SkillsSection />
      <CertificationsSection />
      <AwardsSection />
      <InterestsSection />
    </div>
  );
}
