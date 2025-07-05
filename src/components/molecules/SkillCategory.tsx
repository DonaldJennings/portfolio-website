import React from 'react';
import SkillTag from '@/components/atoms/SkillTag';

interface SkillCategoryProps {
  title: string;
  skills: string[];
  variant?: 'blue' | 'green' | 'purple';
}

export default function SkillCategory({ title, skills, variant = 'blue' }: SkillCategoryProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <SkillTag key={skill} skill={skill} variant={variant} />
        ))}
      </div>
    </div>
  );
}
