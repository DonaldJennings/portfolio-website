'use client';

import JobCard from '@/components/molecules/JobCard';
import type { ExperienceEntry } from '@/lib/admin/contentStore';

type ExperienceListProps = {
  jobs: ExperienceEntry[];
};

export default function ExperienceList({ jobs }: ExperienceListProps) {
  // Sort by most-recent role start date within each company
  const parseYear = (dates?: string): number | null => {
    if (!dates) return null;
    const m = dates.match(/(\d{4})/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return Number.isNaN(y) ? null : y;
  };

  const sorted = [...jobs].sort((a, b) => {
    const aYear = parseYear(a.roles?.[0]?.dates);
    const bYear = parseYear(b.roles?.[0]?.dates);
    if (aYear === null && bYear === null) return 0;
    if (aYear === null) return 1;
    if (bYear === null) return -1;
    return bYear - aYear;
  });

  if (sorted.length === 0) {
    return <p className="text-slate-500 text-sm">No experience entries yet.</p>;
  }

  return (
    <div className="space-y-0">
      {sorted.map((job, idx) => (
        <JobCard
          key={job.company + idx}
          company={job.company}
          logoUrl={job.logoUrl}
          websiteUrl={job.websiteUrl}
          roles={job.roles?.map(r => ({
            title: r.role,
            dates: r.dates,
            description: r.description,
            skills: r.skills,
            isCurrent: r.isCurrent,
          }))}
          isLast={idx === sorted.length - 1}
        />
      ))}
    </div>
  );
}
