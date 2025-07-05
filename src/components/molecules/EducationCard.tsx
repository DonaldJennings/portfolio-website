import React from 'react';

type EducationCardProps = {
  degree: string;
  institution?: string;
  results?: string;
  dateRange?: string;
  description: string;
  borderColor?: string;
  className?: string;
};

export default function EducationCard({
  degree,
  institution,
  results,
  dateRange,
  description,
  borderColor = 'border-green-500',
  className = '',
}: EducationCardProps) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700 ${className}`}
    >
      <div className={`border-l-4 ${borderColor} pl-6`}>
        <h3 className="text-xl font-semibold text-white">{degree}</h3>
        {results && <p className="text-slate-400 text-sm mb-2">{results}</p>}
        {institution && <p className="text-blue-400 font-medium">{institution}</p>}
        {dateRange && <p className="text-slate-400 text-sm mb-2">{dateRange}</p>}
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  );
}
