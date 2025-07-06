'use client';

import JobRole from '../atoms/JobRole';
import CompanyName from '../atoms/CompanyName';
import JobDates from '../atoms/JobDates';
import JobDescription from '../atoms/JobDescription';
import SkillTag from '../atoms/SkillTag';

interface JobCardProps {
  role: string;
  company: string;
  dates: string;
  description: string;
  skills?: string[];
  isCurrent?: boolean;
}

export default function JobCard({
  role,
  company,
  dates,
  description,
  skills,
  isCurrent = false,
}: JobCardProps) {
  return (
    <div className="relative pb-8 last:pb-0">
      {/* Vertical line and dot indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        {isCurrent ? (
          <>
            {/* Green vertical line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-green-500"></div>
            {/* Pulsing dot for current role - positioned over the line with solid background */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            </div>
          </>
        ) : (
          <>
            {/* Gray vertical line for previous roles */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-slate-600"></div>
            {/* Static dot for previous roles */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-900"></div>
          </>
        )}
      </div>

      {/* Job card content */}
      <div className="ml-10 py-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <JobRole jobTitle={role} isCurrent={isCurrent} />
            <CompanyName companyName={company} />
            <JobDates dateRange={dates} />
          </div>

          <JobDescription description={description} />

          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <SkillTag key={index} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
