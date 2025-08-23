'use client';

import JobRole from '../atoms/JobRole';
import CompanyName from '../atoms/CompanyName';
import JobDates from '../atoms/JobDates';
import JobDescription from '../atoms/JobDescription';
import SkillTag from '../atoms/SkillTag';

export interface JobTimelineRole {
  title: string;
  dates: string;
  description?: string;
  skills?: string[];
  isCurrent?: boolean;
}

export interface JobCardProps {
  company: string;
  // If roles is provided, use timeline mode. Otherwise, use legacy props.
  roles?: JobTimelineRole[];
  // Legacy props:
  role?: string;
  dates?: string;
  description?: string;
  skills?: string[];
  isCurrent?: boolean;
}

export default function JobCard({
  company,
  roles,
  // legacy props
  role,
  dates,
  description,
  skills,
  isCurrent = false,
}: JobCardProps) {
  // If roles array is provided, render timeline mode
  // Helper to render skills
  const renderSkills = (skills?: string[]) =>
    skills && skills.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, i) => (
          <SkillTag key={i} skill={skill} />
        ))}
      </div>
    ) : null;

  // Helper to render a single role block
  const renderRoleBlock = ({
    title,
    dates,
    description,
    skills,
    isCurrent,
    dotClassName,
    dotWrapperClassName,
  }: {
    title: string;
    dates: string;
    description?: string;
    skills?: string[];
    isCurrent?: boolean;
    dotClassName?: string;
    dotWrapperClassName?: string;
  }) => (
    <div className="relative">
      {/* Dot indicator */}
      <div className={dotWrapperClassName}>
        <div className={`rounded-full ${dotClassName}`}></div>
      </div>
      <div className="space-y-1">
        <JobRole jobTitle={title} isCurrent={isCurrent} />
        <JobDates dateRange={dates} />
        {description && <JobDescription description={description} />}
        {renderSkills(skills)}
      </div>
    </div>
  );

  if (roles && roles.length > 0) {
    return (
      <div className="relative pb-8 last:pb-0">
        {/* Timeline vertical line (only for timeline mode) */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-600" />
        <div className="ml-10 py-2">
          <CompanyName companyName={company} />
          {roles.length > 1 && (
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Internal Progression
            </div>
          )}
          <div className="space-y-8 mt-2">
            {roles.map((r, idx) =>
              renderRoleBlock({
                ...r,
                dotWrapperClassName:
                  'absolute -left-11 top-2 w-3 h-3 flex items-center justify-center',
                dotClassName: `w-3 h-3 ${
                  r.isCurrent
                    ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50'
                    : 'bg-slate-600 border-2 border-slate-900'
                }`,
              }),
            )}
          </div>
        </div>
      </div>
    );
  }

  // Legacy mode
  return (
    <div className="relative pb-8 last:pb-0">
      {/* Vertical line and dot indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        {isCurrent ? (
          <>
            {/* Green vertical line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-green-500"></div>
            {/* Pulsing dot for current role */}
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
            <JobRole jobTitle={role!} isCurrent={isCurrent} />
            <CompanyName companyName={company} />
            <JobDates dateRange={dates!} />
          </div>
          {description && <JobDescription description={description} />}
          {renderSkills(skills)}
        </div>
      </div>
    </div>
  );
}
