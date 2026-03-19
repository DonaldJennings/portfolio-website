import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type EducationCardProps = {
  degreeTitle?: string;
  degree: string;
  institution?: string;
  results?: string;
  dateRange?: string;
  description: string[];
  borderColor?: string;
  className?: string;
};

export default function EducationCard({
  degreeTitle,
  degree,
  institution,
  results,
  dateRange,
  description,
  borderColor = 'border-teal-500',
  className = '',
}: EducationCardProps) {
  return (
    <div
      className={`rounded-xl p-5 md:p-6 ${className}`}
      style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(71,85,105,0.3)' }}
    >
      <div className="flex items-start gap-4">
        {/* Icon column */}
        <div
          className={`hidden sm:flex w-10 h-10 rounded-lg items-center justify-center text-lg flex-shrink-0 border-l-2 ${borderColor}`}
          style={{ background: 'rgba(15,23,42,0.8)' }}
        >
          🎓
        </div>

        <div className="flex-1 min-w-0">
          {/* Institution + dates row */}
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            {institution && (
              <span className="text-teal-400 font-semibold text-sm">{institution}</span>
            )}
            {dateRange && (
              <span className="flex-shrink-0 text-[11px] text-slate-500 bg-slate-800/70 px-2.5 py-0.5 rounded-full">
                {dateRange}
              </span>
            )}
          </div>

          {/* Degree */}
          <h3 className="text-white font-bold text-base leading-snug">{degree}</h3>
          {degreeTitle && (
            <p className="text-slate-400 text-xs mt-0.5">{degreeTitle}</p>
          )}

          {/* Results badge */}
          {results && (
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
              {results}
            </span>
          )}

          {/* Description */}
          {description && description.length > 0 && (
            <div className="mt-3 space-y-1 text-slate-400 text-sm leading-relaxed">
              {description.map((paragraph, index) => (
                <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                  {paragraph}
                </ReactMarkdown>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
