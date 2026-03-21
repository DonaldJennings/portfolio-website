'use client';

import type { EducationEntry, PublicationEntry, AwardEntry } from '@/lib/admin/contentStore';
import EducationCard from '@/components/molecules/EducationCard';

type EducationShowcaseProps = {
  education: EducationEntry[];
  publications: PublicationEntry[];
  awards: AwardEntry[];
  panelStyle: React.CSSProperties;
};

export default function EducationShowcase({ education, publications, awards, panelStyle }: EducationShowcaseProps) {
  const parseStartYear = (dr?: string): number | null => {
    if (!dr) return null;
    const m = dr.match(/(\d{4})/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return Number.isNaN(y) ? null : y;
  };

  const sorted = [...education].sort((a, b) => {
    const aYear = parseStartYear(a.dateRange);
    const bYear = parseStartYear(b.dateRange);
    if (aYear === null && bYear === null) return 0;
    if (aYear === null) return 1;
    if (bYear === null) return -1;
    return bYear - aYear;
  });

  if (sorted.length === 0 && publications.length === 0 && awards.length === 0) return null;

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Education & Research</h2>
            <p className="text-slate-500 text-[11px] font-mono">
              {education.length} {education.length === 1 ? 'degree' : 'degrees'}
              {publications.length > 0 && ` · ${publications.length} ${publications.length === 1 ? 'publication' : 'publications'}`}
              {awards.length > 0 && ` · ${awards.length} ${awards.length === 1 ? 'award' : 'awards'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 space-y-8">
        {/* Degree cards */}
        {sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map((edu, idx) => (
              <EducationCard
                key={`${edu.degree}-${idx}`}
                degreeTitle={edu.degreeTitle}
                degree={edu.degree}
                institution={edu.institution}
                results={edu.results}
                dateRange={edu.dateRange}
                description={edu.description}
                borderColor={edu.borderColor}
              />
            ))}
          </div>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Publications</span>
              <span className="flex-1 h-px bg-slate-700/40" />
            </div>
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="rounded-xl px-4 py-3.5"
                  style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(71,85,105,0.3)' }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      {pub.url ? (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-200 text-sm font-semibold leading-snug hover:text-white transition-colors inline-flex items-center gap-1 group"
                        >
                          {pub.title}
                          <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <p className="text-slate-200 text-sm font-semibold leading-snug">{pub.title}</p>
                      )}
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{pub.authors}</p>
                    </div>
                    <span className="flex-shrink-0 text-[11px] text-slate-500 bg-slate-800/70 px-2.5 py-0.5 rounded-full">
                      {pub.year}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 font-mono">{pub.venue}</p>
                  {pub.doi && (
                    <p className="text-[10px] text-slate-600 mt-1 font-mono">DOI: {pub.doi}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Awards & Recognition</span>
              <span className="flex-1 h-px bg-slate-700/40" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="rounded-xl px-4 py-3.5 flex items-start gap-3"
                  style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(71,85,105,0.3)' }}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">🏆</span>
                  <div className="min-w-0">
                    <p className="text-slate-200 text-sm font-semibold leading-snug">{award.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{award.org} · {award.year}</p>
                    {award.description && (
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{award.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
