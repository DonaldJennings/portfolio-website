import React from 'react';
import type { SkillCategoryEntry } from '@/lib/admin/contentStore';

const ACCENT_MAP: Record<string, string> = {
  blue: 'text-blue-400',
  teal: 'text-teal-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  amber: 'text-amber-400',
};

const CHIP_COLORS = [
  'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'bg-teal-500/15 text-teal-300 border-teal-500/25',
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  'bg-green-500/15 text-green-300 border-green-500/25',
  'bg-amber-500/15 text-amber-300 border-amber-500/25',
];

function chipColor(skill: string, catIdx: number) {
  let h = catIdx;
  for (let i = 0; i < skill.length; i++) h = (h * 31 + skill.charCodeAt(i)) & 0xffff;
  return CHIP_COLORS[h % CHIP_COLORS.length];
}

export default function SkillsSection({ categories }: { categories: SkillCategoryEntry[] }) {
  if (categories.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Skills</h3>
      <div className="space-y-4">
        {categories.map((cat, catIdx) => (
          <div key={cat.title}>
            <p className={`text-xs font-semibold mb-2 ${ACCENT_MAP[cat.accent] ?? 'text-slate-400'}`}>{cat.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map(skill => (
                <span key={skill} className={`px-2.5 py-0.5 rounded text-xs font-medium border ${chipColor(skill, catIdx)}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
