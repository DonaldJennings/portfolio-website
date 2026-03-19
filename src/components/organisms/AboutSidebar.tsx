import React from 'react';
import SkillsSection from '@/components/organisms/SkillsSection';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import InterestsSection from '@/components/organisms/InterestsSection';
import AwardsSection from '@/components/organisms/AwardsSection';
import type { SkillCategoryEntry, AwardEntry, InterestEntry } from '@/lib/admin/contentStore';

type AboutSidebarProps = {
  categories: SkillCategoryEntry[];
  certifications: string[];
  awards: AwardEntry[];
  interests: InterestEntry[];
};

export default function AboutSidebar({ categories, certifications, awards, interests }: AboutSidebarProps) {
  return (
    <div className="space-y-8 w-full min-w-[220px] max-w-xs mx-auto">
      <SkillsSection categories={categories} />
      <CertificationsSection certifications={certifications} />
      <AwardsSection awards={awards} />
      <InterestsSection interests={interests} />
    </div>
  );
}
