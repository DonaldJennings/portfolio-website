import React from 'react';
import CertificationItem from '@/components/atoms/CertificationItem';

const certifications = ['MIET (Member of IET)', 'Certified SAFe 6.0 Scrum Master'];

export default function CertificationsSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Certifications</h2>
      <div className="space-y-4">
        {certifications.map(cert => (
          <CertificationItem key={cert} certification={cert} />
        ))}
      </div>
    </div>
  );
}
