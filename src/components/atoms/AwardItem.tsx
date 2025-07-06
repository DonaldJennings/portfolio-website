import React from 'react';

interface AwardItemProps {
  title: string;
  organization: string;
  year: string;
  description?: string;
}

export default function AwardItem({ title, organization, year, description }: AwardItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{title}</h4>
        <span className="text-sm text-green-400 font-medium">{year}</span>
      </div>
      <p className="text-blue-400 font-medium">{organization}</p>
      {description && <p className="text-gray-300 text-sm leading-relaxed">{description}</p>}
    </div>
  );
}
