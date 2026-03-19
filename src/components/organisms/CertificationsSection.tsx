import React from 'react';

export default function CertificationsSection({ certifications }: { certifications: string[] }) {
  if (certifications.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Certifications</h3>
      <div className="flex flex-wrap gap-2">
        {certifications.map(cert => (
          <span
            key={cert}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-200 border border-slate-600/50"
            style={{ background: 'rgba(30,41,59,0.6)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            {cert}
          </span>
        ))}
      </div>
    </div>
  );
}
