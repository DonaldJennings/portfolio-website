import JobCard from '@/components/molecules/JobCard';
import type { JobCardProps } from '@/components/molecules/JobCard';
import { getContentStore } from '@/lib/admin/contentStore';

export default function ExperienceList() {
  const jobs: JobCardProps[] = getContentStore().experience.map(job => ({
    company: job.company,
    role: job.role,
    dates: job.dates,
    description: job.description,
    skills: job.skills,
    isCurrent: job.isCurrent,
  }));

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
