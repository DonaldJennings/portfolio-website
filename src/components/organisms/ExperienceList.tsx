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
        {jobs.map((job, idx) => (
          <JobCard key={job.company + job.role + idx} {...job} />
        ))}
      </div>
    </div>
  );
}
