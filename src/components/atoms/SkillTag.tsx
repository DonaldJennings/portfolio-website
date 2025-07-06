import React from 'react';

interface SkillTagProps {
  skill: string;
  variant?: 'blue' | 'green' | 'purple';
}

export default function SkillTag({ skill, variant = 'blue' }: SkillTagProps) {
  const variantClasses = {
    blue: 'bg-blue-600/20 text-blue-300 border border-blue-600/30',
    green: 'bg-green-600/20 text-green-300 border border-green-600/30',
    purple: 'bg-purple-600/20 text-purple-300 border border-purple-600/30',
  };

  return (
    <span className={`px-3 py-1 ${variantClasses[variant]} rounded-full text-sm font-medium`}>
      {skill}
    </span>
  );
}
