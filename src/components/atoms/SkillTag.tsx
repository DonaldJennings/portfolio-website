import React from 'react';

interface SkillTagProps {
  skill: string;
  variant?: 'blue' | 'green' | 'purple';
}

export default function SkillTag({ skill, variant = 'blue' }: SkillTagProps) {
  const variantClasses = {
    blue: 'bg-blue-600/20 text-blue-300',
    green: 'bg-green-600/20 text-green-300',
    purple: 'bg-purple-600/20 text-purple-300',
  };

  return (
    <span className={`px-3 py-1 ${variantClasses[variant]} rounded-full text-sm`}>{skill}</span>
  );
}
