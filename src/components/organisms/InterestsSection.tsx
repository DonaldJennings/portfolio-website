import React from 'react';
import InterestItem from '@/components/atoms/InterestItem';

const interests = [
  'Emerging Technologies',
  'Open Source Projects',
  'Software Architecture',
  'Continuous Learning',
];

export default function InterestsSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Interests</h2>
      <div className="space-y-3">
        {interests.map(interest => (
          <InterestItem key={interest} interest={interest} />
        ))}
      </div>
    </div>
  );
}
