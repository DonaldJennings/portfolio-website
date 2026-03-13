'use client';

import React, { useEffect, useState } from 'react';
import EducationCard from '@/components/molecules/EducationCard';

type EducationEntry = {
  degree: string;
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
        setEducation(data.education || []);
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
