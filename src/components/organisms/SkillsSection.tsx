import React from 'react';
import SkillCategory from '@/components/molecules/SkillCategory';

const skillsData = [
  {
    title: 'Programming Languages',
    skills: ['C++', 'C', 'Python', 'Java', 'Haskell'],
    variant: 'blue' as const,
  },
  {
    title: 'Frameworks & Tools',
    skills: ['React', 'Next.js', 'Node.js', 'Git', 'Docker', 'Qt'],
    variant: 'green' as const,
  },
  {
    title: 'Specializations',
    skills: ['Software Engineering', 'System Design', 'Software Architecture'],
    variant: 'purple' as const,
  },
];

export default function SkillsSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Skills</h2>
      <div className="space-y-4">
        {skillsData.map(category => (
          <SkillCategory
            key={category.title}
            title={category.title}
            skills={category.skills}
            variant={category.variant}
          />
        ))}
      </div>
    </div>
  );
}
