'use client';

import { useEffect, useState } from 'react';
import JobCard from '@/components/molecules/JobCard';
import type { JobCardProps } from '@/components/molecules/JobCard';

type ExperienceEntry = {
  company: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
};

export default function ExperienceList() {
  const [jobs, setJobs] = useState<JobCardProps[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function loadExperience() {
      const response = await fetch('/api/experience');
      if (!response.ok) return;

      const data = (await response.json()) as { experience: ExperienceEntry[] };
      setJobs(
        data.experience.map(job => ({
          company: job.company,
          role: job.role,
          dates: job.dates,
          description: job.description,
          skills: job.skills,
          isCurrent: job.isCurrent,
        })),
      );
    }

    void loadExperience();
  }, []);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-8">Experience</h2>
      <div className="relative">
        {(() => {
          // parse start year from dates string (e.g. "2020 - 2024" or "2020 - Present")
          const parseStartYear = (dates?: string): number | null => {
            if (!dates) return null;
            const m = dates.match(/(\d{4})/);
            if (!m) return null;
            const y = parseInt(m[1], 10);
            return Number.isNaN(y) ? null : y;
          };

          const sorted = [...jobs].sort((a, b) => {
            const aYear = parseStartYear(a.dates);
            const bYear = parseStartYear(b.dates);
            if (aYear === null && bYear === null) return 0;
            if (aYear === null) return 1;
            if (bYear === null) return -1;
            return bYear - aYear;
          });

          const top = sorted.slice(0, 2);
          const rest = sorted.slice(2);

          return (
            <>
              {top.map((job, idx) => (
                <JobCard key={job.company + job.role + idx} {...job} />
              ))}

              {rest.length > 0 && (
                <div className="mt-4">
                  <div
                    className="relative overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: expanded ? `${rest.length * 220}px` : '0px',
                      opacity: expanded ? 1 : 0.9,
                    }}
                    aria-hidden={!expanded}
                  >
                    <div className="space-y-4 p-2">
                      {rest.map((job, idx) => (
                        <JobCard key={job.company + job.role + idx + '-rest'} {...job} />
                      ))}
                    </div>

                    {/* fade overlay when collapsed */}
                    {!expanded && (
                      <div
                        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.85) 60%, rgba(15,23,42,0.95) 100%)',
                        }}
                      />
                    )}
                  </div>

                  <div className="flex justify-center mt-3">
                    <button
                      aria-expanded={expanded}
                      onClick={() => setExpanded(s => !s)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-slate-700 rounded text-sm"
                    >
                      <span>{expanded ? 'Show less' : `Show ${rest.length} more`}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
