import React from 'react';
import EducationCard from '@/components/molecules/EducationCard';

export default function EducationSection() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
      <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
      <EducationCard
        degree="BSc (Hons) Computer Science"
        institution="University of Edinburgh"
        results="First Class Honours"
        dateRange="2020 - 2024"
        description="Graduated with First Class Honours, specializing in software engineering and system design."
        borderColor="border-blue-500"
      />
    </div>
  );
}
