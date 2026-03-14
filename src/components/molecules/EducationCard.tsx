import React from 'react';

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
  borderColor = 'border-green-500',
  className = '',
}: EducationCardProps) {
  return (
    <div className={`${className}`}>
      <div className={`border-l-4 ${borderColor} pl-6`}>
        {degreeTitle && <p className="text-sm text-slate-400 mb-1">{degreeTitle}</p>}
        <h3 className="text-xl font-semibold text-white">{degree}</h3>
        {results && <p className="text-slate-400 text-sm mb-2">{results}</p>}
        {institution && <p className="text-blue-400 font-medium">{institution}</p>}
        {dateRange && <p className="text-slate-400 text-sm mb-2">{dateRange}</p>}
        <div className="text-slate-300 space-y-2">
          {description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
