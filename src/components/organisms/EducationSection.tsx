import React from 'react';
import EducationCard from '@/components/molecules/EducationCard';
import type { EducationEntry } from '@/lib/admin/contentStore';

type EducationSectionProps = {
  education: EducationEntry[];
};

export default function EducationSection({ education }: EducationSectionProps) {
  const parseStartYear = (dr?: string): number | null => {
    if (!dr) return null;
    const m = dr.match(/(\d{4})/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return Number.isNaN(y) ? null : y;
  };

  const sorted = [...education].sort((a, b) => {
    const aYear = parseStartYear(a.dateRange);
    const bYear = parseStartYear(b.dateRange);
    if (aYear === null && bYear === null) return 0;
    if (aYear === null) return 1;
    if (bYear === null) return -1;
    return bYear - aYear;
  });

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
      <div className="space-y-6">
        {sorted.map((edu, idx) => (
          <EducationCard
            key={`${edu.degree}-${idx}`}
            degreeTitle={edu.degreeTitle}
            degree={edu.degree}
            institution={edu.institution}
            results={edu.results}
            dateRange={edu.dateRange}
            description={edu.description}
            borderColor={edu.borderColor}
          />
        ))}
      </div>
    </div>
  );
}
