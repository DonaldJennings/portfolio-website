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

const COLLAPSED_HEIGHT = 600;

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

  const hasMore = sorted.length > 2;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-8">Experience</h2>
      <div className="relative">
        {/* Single container — all cards together so the timeline line is continuous.
            -ml-3 pl-3 widens the overflow boundary leftward so the dot (which
            extends ~6 px left of left-0) is never clipped by overflow-hidden. */}
        <div
          className="relative overflow-hidden -ml-3 pl-3"
          style={{
            maxHeight: expanded ? '2000px' : `${COLLAPSED_HEIGHT}px`,
            transition: 'max-height 0.55s ease-in-out',
          }}
        >
          {sorted.map((job, idx) => (
            <JobCard key={job.company + (job.role ?? '') + idx} {...job} />
          ))}

          {/* Gradient fade when collapsed — colour matches bg-slate-800/30 over the
              page gradient (#1e293b at this scroll depth), so it blends flush. */}
          {hasMore && !expanded && (
            <div
              className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(30,41,59,0.75) 50%, rgba(30,41,59,0.97) 100%)',
              }}
            />
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-3">
            <button
              aria-expanded={expanded}
              onClick={() => setExpanded(s => !s)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-slate-700 rounded text-sm"
            >
              <span>{expanded ? 'Show less' : `Show ${sorted.length - 2} more`}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : 'rotate-0'}`}
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
        )}
      </div>
    </div>
  );
}
