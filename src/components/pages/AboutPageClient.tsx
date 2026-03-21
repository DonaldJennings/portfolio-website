'use client';

import { useState } from 'react';
import type {
  ProfileData,
  ExperienceEntry,
  EducationEntry,
  PublicationEntry,
  SkillCategoryEntry,
  AwardEntry,
  InterestEntry,
  HighlightEntry,
} from '@/lib/admin/contentStore';

type Section = 'overview' | 'experience' | 'education' | 'skills';

type Props = {
  profile: ProfileData;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  skillCategories: SkillCategoryEntry[];
  certifications: string[];
  awards: AwardEntry[];
  interests: InterestEntry[];
  highlights: HighlightEntry[];
};

const panel = {
  background: 'rgba(var(--surface-base-rgb),0.72)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(var(--border-faint-rgb),0.2)',
};

const SKILL_COLORS = [
  'bg-sky-500/15 text-sky-300 border-sky-500/25',
  'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'bg-teal-500/15 text-teal-300 border-teal-500/25',
  'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  'bg-amber-500/15 text-amber-300 border-amber-500/25',
  'bg-rose-500/15 text-rose-300 border-rose-500/25',
];

function skillColor(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return SKILL_COLORS[h % SKILL_COLORS.length];
}

// ── Section nav ────────────────────────────────────────────────────────────
const NAV: { id: Section; label: string; icon: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
];

// ── Overview ────────────────────────────────────────────────────────────────
function OverviewSection({
  profile,
  experience,
  education,
  publications,
  awards,
  skillCategories,
  highlights,
  onNavigate,
}: {
  profile: ProfileData;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  awards: AwardEntry[];
  skillCategories: SkillCategoryEntry[];
  highlights: HighlightEntry[];
  onNavigate: (s: Section) => void;
}) {
  const currentRole = experience
    .flatMap(e => e.roles.map(r => ({ ...r, company: e.company })))
    .find(r => r.isCurrent);

  const topDegree = [...education].sort((a, b) => {
    const parse = (d?: string) => { const m = d?.match(/(\d{4})/); return m ? +m[1] : 0; };
    return parse(b.dateRange) - parse(a.dateRange);
  })[0];

  const allSkills = skillCategories.flatMap(c => c.skills).slice(0, 12);

  const cards: { section: Section; icon: string; title: string; body: string }[] = [
    {
      section: 'experience',
      icon: '💼',
      title: currentRole ? `${currentRole.role}` : 'Industry Experience',
      body: currentRole
        ? `Currently at ${currentRole.company} · ${experience.length} employer${experience.length !== 1 ? 's' : ''}, ${experience.reduce((a, e) => a + e.roles.length, 0)} roles`
        : `${experience.length} employer${experience.length !== 1 ? 's' : ''}`,
    },
    {
      section: 'education',
      icon: '🎓',
      title: topDegree?.degree ?? 'Education',
      body: [topDegree?.institution, topDegree?.results].filter(Boolean).join(' · ') +
        (publications.length > 0 ? ` · ${publications.length} publication${publications.length !== 1 ? 's' : ''}` : ''),
    },
    {
      section: 'skills',
      icon: '⚡',
      title: 'Technical Skills',
      body: `${skillCategories.length} skill categories · ${allSkills.slice(0, 4).join(', ')}${allSkills.length > 4 ? ' & more' : ''}`,
    },
  ];

  return (
    <div className="space-y-5 animate-about-fade">
      {/* Bio */}
      <div className="rounded-2xl p-6" style={panel}>
        <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
        {highlights.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-700/40 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {highlights.map(h => (
              <div key={h.label} className="flex items-center gap-2.5">
                <span className="text-base flex-shrink-0">{h.icon}</span>
                <div className="min-w-0">
                  <p className="text-slate-200 text-xs font-medium truncate">{h.label}</p>
                  <p className="text-slate-500 text-[10px] truncate">{h.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapter cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {cards.map(c => (
          <button
            key={c.section}
            onClick={() => onNavigate(c.section)}
            className="group text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              ...panel,
              borderColor: 'rgba(var(--border-faint-rgb),0.2)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border-faint-rgb),0.2)'; }}
          >
            <span className="text-2xl mb-3 block">{c.icon}</span>
            <p className="text-white text-sm font-semibold leading-snug mb-1 group-hover:text-white transition-colors">
              {c.title}
            </p>
            <p className="text-slate-500 text-[11px] font-mono leading-relaxed mb-3">{c.body}</p>
            <span className="text-[11px] font-semibold flex items-center gap-1 transition-all duration-200 group-hover:gap-2" style={{ color: 'var(--accent-1)' }}>
              Explore
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {awards.length > 0 && (
        <div className="rounded-2xl p-5" style={panel}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Awards & Recognition</p>
          <div className="flex flex-wrap gap-2">
            {awards.map((a, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(var(--accent-1-rgb),0.08)', border: '1px solid rgba(var(--accent-1-rgb),0.2)', color: 'var(--accent-1)' }}
              >
                🏆 {a.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Experience ──────────────────────────────────────────────────────────────
function ExperienceSection({ experience }: { experience: ExperienceEntry[] }) {
  const sorted = [...experience].sort((a, b) => {
    const parse = (e: ExperienceEntry) => {
      const m = e.roles[0]?.dates?.match(/(\d{4})/);
      return m ? +m[1] : 0;
    };
    const aCurrent = a.roles.some(r => r.isCurrent);
    const bCurrent = b.roles.some(r => r.isCurrent);
    if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;
    return parse(b) - parse(a);
  });

  const defaultOpen = new Set(sorted.filter(e => e.roles.some(r => r.isCurrent)).map(e => e.company));
  const [open, setOpen] = useState<Set<string>>(defaultOpen);

  const toggle = (company: string) => {
    setOpen(prev => {
      const next = new Set(prev);
      next.has(company) ? next.delete(company) : next.add(company);
      return next;
    });
  };

  return (
    <div className="space-y-3 animate-about-fade">
      {sorted.map(entry => {
        const isCurrent = entry.roles.some(r => r.isCurrent);
        const isOpen = open.has(entry.company);
        const headline = entry.roles.find(r => r.isCurrent) ?? entry.roles[0];

        return (
          <div key={entry.company} className="rounded-2xl overflow-hidden" style={panel}>

            {/* ── Collapsed header ── */}
            <button
              className="w-full flex items-center gap-3 sm:gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
              onClick={() => toggle(entry.company)}
            >
              {/* Logo / initial */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'rgba(var(--surface-elevated-rgb),0.9)', border: '1px solid rgba(var(--border-mid-rgb),0.4)' }}
              >
                {entry.logoUrl
                  ? <img src={entry.logoUrl} alt={entry.company} className="w-full h-full object-contain p-0.5" />
                  : <span className="text-sm font-bold text-slate-200">{entry.company.charAt(0)}</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{entry.company}</span>
                  {isCurrent && (
                    <span
                      className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--accent-1)', background: 'rgba(var(--accent-1-rgb),0.1)', border: '1px solid rgba(var(--accent-1-rgb),0.2)' }}
                    >
                      <span className="w-1 h-1 rounded-full animate-pulse inline-block" style={{ background: 'var(--accent-1)' }} />
                      Now
                    </span>
                  )}
                </div>
                {/* Role + date always visible */}
                <p className="text-slate-400 text-xs mt-0.5">
                  <span className="truncate">{headline?.role}</span>
                  <span className="text-slate-600 mx-1.5">·</span>
                  <span className="text-slate-500">{headline?.dates}</span>
                  {entry.roles.length > 1 && !isOpen && (
                    <span className="text-slate-600"> · +{entry.roles.length - 1} more</span>
                  )}
                </p>
              </div>

              <svg
                className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* ── Expanded roles ── */}
            {isOpen && (
              <div className="border-t border-slate-700/40">
                {entry.roles.map((role, i) => {
                  const isLast = i === entry.roles.length - 1;
                  return (
                    <div
                      key={i}
                      className={`px-5 py-5 flex gap-4 ${!isLast ? 'border-b border-slate-700/30' : ''}`}
                    >
                      {/* Timeline column */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-0.5" style={{ width: 16 }}>
                        {role.isCurrent ? (
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                            style={{ background: 'var(--accent-1)', boxShadow: '0 0 6px var(--accent-1)' }}
                          />
                        ) : (
                          <span className="w-3 h-3 rounded-full flex-shrink-0 border-2 border-slate-600 bg-slate-900" />
                        )}
                        {/* Connector line to next role */}
                        {!isLast && (
                          <div className="flex-1 w-px mt-2" style={{ background: 'rgba(var(--border-mid-rgb),0.4)' }} />
                        )}
                      </div>

                      {/* Content column */}
                      <div className="flex-1 min-w-0">
                        {/* Role title + date */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-slate-100 text-sm font-semibold leading-snug">{role.role}</p>
                          <span className="text-[11px] text-slate-500 bg-slate-800/60 px-2.5 py-0.5 rounded-full flex-shrink-0 leading-snug">
                            {role.dates}
                          </span>
                        </div>

                        {/* Description — visually separated */}
                        {role.description && (
                          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap mb-3 pl-3 border-l border-slate-700/60">
                            {role.description}
                          </p>
                        )}

                        {/* Skills — clearly labelled as metadata */}
                        {role.skills && role.skills.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1.5">Stack</p>
                            <div className="flex flex-wrap gap-1.5">
                              {role.skills.map(s => (
                                <span key={s} className={`px-2 py-0.5 rounded text-[11px] font-medium border ${skillColor(s)}`}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Education ───────────────────────────────────────────────────────────────
function EducationSection({
  education,
  publications,
  awards,
}: {
  education: EducationEntry[];
  publications: PublicationEntry[];
  awards: AwardEntry[];
}) {
  const [openPub, setOpenPub] = useState<number | null>(null);

  const sorted = [...education].sort((a, b) => {
    const parse = (d?: string) => { const m = d?.match(/(\d{4})/); return m ? +m[1] : 0; };
    return parse(b.dateRange) - parse(a.dateRange);
  });

  return (
    <div className="space-y-4 animate-about-fade">
      {/* Degree cards */}
      {sorted.map((edu, i) => (
        <div key={i} className="rounded-2xl p-5 sm:p-6" style={panel}>
          <div className="flex items-start gap-4">
            <div
              className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(var(--accent-1-rgb),0.08)', border: '1px solid rgba(var(--accent-1-rgb),0.2)' }}
            >
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                {edu.institution && <p className="text-xs font-semibold" style={{ color: 'var(--accent-1)' }}>{edu.institution}</p>}
                {edu.dateRange && (
                  <span className="text-[11px] text-slate-500 bg-slate-800/70 px-2.5 py-0.5 rounded-full">{edu.dateRange}</span>
                )}
              </div>
              <h3 className="text-white font-bold text-base leading-snug">{edu.degree}</h3>
              {edu.degreeTitle && <p className="text-slate-400 text-xs mt-0.5">{edu.degreeTitle}</p>}
              {edu.results && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  {edu.results}
                </span>
              )}
              {edu.description && edu.description.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {edu.description.map((line, j) => (
                    <li key={j} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-1)' }}>▸</span>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Publications — each is expandable */}
      {publications.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={panel}>
          <div className="px-5 py-4 border-b border-slate-700/40">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Research & Publications</p>
          </div>
          <div className="divide-y divide-slate-700/40">
            {publications.map((pub, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenPub(openPub === i ? null : i)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium leading-snug truncate">{pub.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-mono">{pub.venue} · {pub.year}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${openPub === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openPub === i && (
                  <div className="px-5 pb-4 pt-1 bg-slate-800/20">
                    <p className="text-slate-400 text-xs leading-relaxed mb-2">{pub.authors}</p>
                    {pub.doi && <p className="text-slate-600 text-[10px] font-mono mb-3">DOI: {pub.doi}</p>}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ color: 'var(--accent-1)' }}>
                        View paper
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {awards.map((a, i) => (
            <div key={i} className="rounded-2xl p-4 flex items-start gap-3" style={panel}>
              <span className="text-xl flex-shrink-0">🏆</span>
              <div className="min-w-0">
                <p className="text-slate-200 text-sm font-semibold leading-snug">{a.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.org} · {a.year}</p>
                {a.description && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skills ───────────────────────────────────────────────────────────────────
function SkillsSection({
  skillCategories,
  certifications,
  interests,
}: {
  skillCategories: SkillCategoryEntry[];
  certifications: string[];
  interests: InterestEntry[];
}) {
  return (
    <div className="space-y-4 animate-about-fade">
      <div className="grid sm:grid-cols-2 gap-3">
        {skillCategories.map(cat => (
          <div key={cat.title} className="rounded-2xl p-5" style={panel}>
            <p className="text-xs font-semibold text-slate-300 mb-3">{cat.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map(skill => (
                <span
                  key={skill}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150 cursor-default hover:scale-105 ${skillColor(skill)}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {certifications.length > 0 && (
        <div className="rounded-2xl p-5" style={panel}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {certifications.map(cert => (
              <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200"
                style={{ background: 'rgba(var(--accent-1-rgb),0.06)', border: '1px solid rgba(var(--accent-1-rgb),0.15)' }}>
                ✓ {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {interests.length > 0 && (
        <div className="rounded-2xl p-5" style={panel}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Interests</p>
          <div className="flex flex-wrap gap-3">
            {interests.map(interest => (
              <span key={interest.label} className="flex items-center gap-1.5 text-sm text-slate-300">
                <span>{interest.icon}</span>
                <span className="text-xs">{interest.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root component ───────────────────────────────────────────────────────────
export default function AboutPageClient({
  profile,
  experience,
  education,
  publications,
  skillCategories,
  certifications,
  awards,
  interests,
  highlights,
}: Props) {
  const [section, setSection] = useState<Section>('overview');

  const yearsInIndustry = (() => {
    const years = experience
      .flatMap(e => e.roles.map(r => r.dates))
      .flatMap(d => { const m = d?.match(/(\d{4})/g); return m ? m.map(Number) : []; });
    return years.length ? new Date().getFullYear() - Math.min(...years) : null;
  })();

  return (
    <main className="relative w-full font-mono pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* ── Profile strip ── */}
        <div className="rounded-2xl p-5 sm:p-6 mb-6" style={panel}>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ background: 'var(--avatar-gradient)' }}
            >
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                : profile.name?.charAt(0)?.toUpperCase() ?? 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">{profile.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--accent-1)' }}>{profile.role}</p>
              <p className="text-slate-500 text-xs mt-0.5">{profile.company} · {profile.location}</p>
            </div>
            {/* Inline stats */}
            <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
              {yearsInIndustry !== null && (
                <div className="text-center">
                  <p className="text-xl font-bold text-white leading-none">{yearsInIndustry}+</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">yrs</p>
                </div>
              )}
              {publications.length > 0 && (
                <div className="text-center">
                  <p className="text-xl font-bold text-white leading-none">{publications.length}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">pubs</p>
                </div>
              )}
              {awards.length > 0 && (
                <div className="text-center">
                  <p className="text-xl font-bold text-white leading-none">{awards.length}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">awards</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Section nav ── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-0.5 no-scrollbar">
          {NAV.map(nav => (
            <button
              key={nav.id}
              onClick={() => setSection(nav.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={
                section === nav.id
                  ? { background: 'var(--accent-1)', color: 'rgb(15 23 42)' }
                  : { ...panel, color: 'rgb(148 163 184)' }
              }
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={nav.icon} />
              </svg>
              {nav.label}
            </button>
          ))}
        </div>

        {/* ── Section content ── */}
        <div key={section}>
          {section === 'overview' && (
            <OverviewSection
              profile={profile}
              experience={experience}
              education={education}
              publications={publications}
              awards={awards}
              skillCategories={skillCategories}
              highlights={highlights}
              onNavigate={setSection}
            />
          )}
          {section === 'experience' && <ExperienceSection experience={experience} />}
          {section === 'education' && (
            <EducationSection education={education} publications={publications} awards={awards} />
          )}
          {section === 'skills' && (
            <SkillsSection skillCategories={skillCategories} certifications={certifications} interests={interests} />
          )}
        </div>
      </div>
    </main>
  );
}
