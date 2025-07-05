import React from 'react';

interface CertificationItemProps {
  certification: string;
}

export default function CertificationItem({ certification }: CertificationItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <span className="text-slate-300">{certification}</span>
    </div>
  );
}
