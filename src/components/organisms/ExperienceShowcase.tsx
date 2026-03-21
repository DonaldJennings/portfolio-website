'use client';

import type { ExperienceEntry, ExperienceRole } from '@/lib/admin/contentStore';
import JobCard from '@/components/molecules/JobCard';

type CurrentRoleInfo = ExperienceRole & {
  company: string;
  logoUrl?: string;
  websiteUrl?: string;
};

type ExperienceShowcaseProps = {
  experience: ExperienceEntry[];
  currentRole?: CurrentRoleInfo;
  panelStyle: React.CSSProperties;
};

export default function ExperienceShowcase({ experience, currentRole, panelStyle }: ExperienceShowcaseProps) {
  // Sort entries: current employer first, then by most recent start year
  const parseYear = (dates?: string): number | null => {
    if (!dates) return null;
    const m = dates.match(/(\d{4})/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return Number.isNaN(y) ? null : y;
  };

  const sorted = [...experience].sort((a, b) => {
    const aCurrent = a.roles.some(r => r.isCurrent);
    const bCurrent = b.roles.some(r => r.isCurrent);
    if (aCurrent && !bCurrent) return -1;
    if (!aCurrent && bCurrent) return 1;
    const aYear = parseYear(a.roles?.[0]?.dates);
    const bYear = parseYear(b.roles?.[0]?.dates);
    if (aYear === null && bYear === null) return 0;
    if (aYear === null) return 1;
    if (bYear === null) return -1;
    return bYear - aYear;
  });

  if (sorted.length === 0) return null;

  return (
    <section className="rounded-2xl overflow-hidden" style={panelStyle}>
      {/* Section header */}
      <div className="px-6 md:px-8 pt-6 pb-4 border-b border-slate-700/40">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent-1)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Industry Experience</h2>
            <p className="text-slate-500 text-[11px] font-mono">
              {experience.length} {experience.length === 1 ? 'employer' : 'employers'} ·{' '}
              {experience.reduce((acc, e) => acc + e.roles.length, 0)} roles
            </p>
          </div>
        </div>

        {/* Current role spotlight */}
        {currentRole && (
          <div
            className="mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.18)' }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--accent-1)' }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 leading-tight truncate">
                {currentRole.role} · <span className="font-normal text-slate-400">{currentRole.company}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{currentRole.dates}</p>
            </div>
            <span
              className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ color: 'var(--accent-1)', background: 'rgba(74,222,128,0.1)' }}
            >
              Now
            </span>
          </div>
        )}
      </div>

      {/* Job cards */}
      <div className="px-6 md:px-8 py-6">
        <div className="space-y-0">
          {sorted.map((job, idx) => (
            <JobCard
              key={job.company + idx}
              company={job.company}
              logoUrl={job.logoUrl}
              websiteUrl={job.websiteUrl}
              roles={job.roles.map(r => ({
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
      </div>
    </section>
  );
}
