'use client';

export interface JobTimelineRole {
  title: string;
  dates: string;
  description?: string;
  skills?: string[];
  isCurrent?: boolean;
}

export interface JobCardProps {
  company: string;
  logoUrl?: string;
  websiteUrl?: string;
  roles?: JobTimelineRole[];
  // Legacy props:
  role?: string;
  dates?: string;
  description?: string;
  skills?: string[];
  isCurrent?: boolean;
  isLast?: boolean;
}

const SKILL_COLORS = [
  'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'bg-teal-500/15 text-teal-300 border-teal-500/25',
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  'bg-amber-500/15 text-amber-300 border-amber-500/25',
  'bg-rose-500/15 text-rose-300 border-rose-500/25',
  'bg-green-500/15 text-green-300 border-green-500/25',
  'bg-sky-500/15 text-sky-300 border-sky-500/25',
];

function skillColor(skill: string) {
  let h = 0;
  for (let i = 0; i < skill.length; i++) h = (h * 31 + skill.charCodeAt(i)) & 0xffff;
  return SKILL_COLORS[h % SKILL_COLORS.length];
}

function SkillChips({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {skills.map(s => (
        <span
          key={s}
          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${skillColor(s)}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function RoleEntry({
  title,
  dates,
  description,
  skills,
  isCurrent,
  dot,
}: {
  title: string;
  dates: string;
  description?: string;
  skills?: string[];
  isCurrent?: boolean;
  dot: 'current' | 'normal' | 'inner';
}) {
  return (
    <div className="relative pl-7">
      {/* dot */}
      {dot === 'current' && (
        <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.4)] animate-pulse" />
      )}
      {dot === 'normal' && (
        <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-slate-500 bg-slate-900" />
      )}
      {dot === 'inner' && (
        <span className="absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-slate-500" />
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h4 className={`font-semibold text-sm leading-snug ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
            {title}
          </h4>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-400">
              Current role
            </span>
          )}
        </div>
        <span className="flex-shrink-0 text-[11px] text-slate-500 bg-slate-800/70 px-2.5 py-0.5 rounded-full">
          {dates}
        </span>
      </div>

      {description && (
        <p className="mt-2 text-slate-400 text-sm leading-relaxed">{description}</p>
      )}
      {skills && skills.length > 0 && <SkillChips skills={skills} />}
    </div>
  );
}

export default function JobCard({
  company,
  logoUrl,
  websiteUrl,
  roles,
  role,
  dates,
  description,
  skills,
  isCurrent = false,
  isLast = false,
}: JobCardProps) {
  // Timeline line colour: green if any role is current, else slate
  const hasCurrent =
    isCurrent || (roles ? roles.some(r => r.isCurrent) : false);

  return (
    <div className="relative flex gap-5 pb-8 last:pb-0">
      {/* ── Left column: line ── */}
      <div className="flex flex-col items-center pt-1.5 flex-shrink-0" style={{ width: 2 }}>
        <div
          className={`flex-1 w-0.5 ${isLast ? 'hidden' : hasCurrent ? 'bg-gradient-to-b from-green-500/60 to-slate-700/40' : 'bg-slate-700/60'}`}
        />
      </div>

      {/* ── Right column: content ── */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Company header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Company logo or initial badge */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(71,85,105,0.5)' }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={company} className="w-full h-full object-contain p-0.5" />
            ) : (
              <span className="text-sm font-bold text-slate-200">{company.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold text-sm leading-tight hover:text-teal-400 transition-colors inline-flex items-center gap-1 group"
              >
                {company}
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-white font-semibold text-sm leading-tight">{company}</p>
            )}
            {hasCurrent && (
              <span className="text-[10px] text-green-400 font-medium uppercase tracking-wide">
                Current employer
              </span>
            )}
          </div>
        </div>

        {/* Multi-role (timeline progression) */}
        {roles && roles.length > 0 ? (
          <div className="space-y-5 pl-1">
            {roles.length > 1 && (
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
                <span className="w-4 h-px bg-slate-600" />
                Internal progression
                <span className="flex-1 h-px bg-slate-700" />
              </div>
            )}
            {roles.map((r, i) => (
              <RoleEntry
                key={i}
                title={r.title}
                dates={r.dates}
                description={r.description}
                skills={r.skills}
                isCurrent={r.isCurrent}
                dot={r.isCurrent ? 'current' : roles.length > 1 ? 'inner' : 'normal'}
              />
            ))}
          </div>
        ) : (
          /* Single legacy role */
          <RoleEntry
            title={role!}
            dates={dates!}
            description={description}
            skills={skills}
            isCurrent={isCurrent}
            dot={isCurrent ? 'current' : 'normal'}
          />
        )}
      </div>
    </div>
  );
}
