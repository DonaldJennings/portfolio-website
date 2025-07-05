import React from 'react';
import EducationCard from '@/components/molecules/EducationCard';

export default function EducationSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
      <EducationCard
        degree="BSc (Hons) Computer Science"
        institution="University of Edinburgh"
        results="First Class Honours (79%, 4.0 GPA)"
        dateRange="2020 - 2024"
        description={[
          'Graduated with First Class Honours, specializing in software engineering and system design.',
          'Developed a distributed load-balancing framework for a novel serverless runtime for my undergraduate dissertaion which was published in the ACM Digital Library.',
          'Recipient of the Edinburgh Award (twice) in recognition of significant professional development and extra-currical contribution.',
        ]}
        borderColor="border-blue-500"
      />
    </div>
  );
}
