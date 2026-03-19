import React from 'react';
import type { AwardEntry } from '@/lib/admin/contentStore';

export default function AwardsSection({ awards }: { awards: AwardEntry[] }) {
  if (awards.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Awards</h3>
      <div className="space-y-3">
        {awards.map(award => (
          <div
            key={award.title}
            className="flex gap-4 rounded-xl p-4"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(71,85,105,0.3)' }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">🏆</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-semibold text-sm">{award.title}</p>
                <span className="text-[11px] text-slate-500 bg-slate-800/70 px-2 py-0.5 rounded-full">{award.year}</span>
              </div>
              <p className="text-teal-400 text-xs font-medium mb-1">{award.org}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{award.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
