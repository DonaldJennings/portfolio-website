'use client';

import React, { useEffect, useState } from 'react';
import EducationCard from '@/components/molecules/EducationCard';

type EducationEntry = {
  degree: string;
  degreeTitle?: string;
  institution?: string;
  results?: string;
  dateRange?: string;
  description: string[];
  borderColor?: string;
};

export default function EducationSection() {
  const [education, setEducation] = useState<EducationEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/education')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return;
        const items: EducationEntry[] = data.education || [];

        // Parse start year from dateRange (e.g. "2020 - 2024" or "2020 - Present")
        const parseStartYear = (dr?: string): number | null => {
          if (!dr) return null;
          const m = dr.match(/(\d{4})/);
          if (!m) return null;
          const y = parseInt(m[1], 10);
          if (Number.isNaN(y)) return null;
          return y;
        };

        const sorted = [...items].sort((a, b) => {
          const aYear = parseStartYear(a.dateRange);
          const bYear = parseStartYear(b.dateRange);
          if (aYear === null && bYear === null) return 0;
          if (aYear === null) return 1; // put a after b
          if (bYear === null) return -1; // put b after a
          return bYear - aYear; // most recent start year first
        });

        setEducation(sorted);
      })
      .catch(() => {
        if (!mounted) return;
        setEducation([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
      <div className="space-y-6">
        {education.map((edu, idx) => (
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
