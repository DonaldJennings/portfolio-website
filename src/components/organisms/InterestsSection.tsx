import React from 'react';
import type { InterestEntry } from '@/lib/admin/contentStore';

export default function InterestsSection({ interests }: { interests: InterestEntry[] }) {
  if (interests.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {interests.map(item => (
          <span
            key={item.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 border border-slate-600/40"
            style={{ background: 'rgba(30,41,59,0.5)' }}
          >
            <span>{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
