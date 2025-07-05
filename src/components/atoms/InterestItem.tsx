import React from 'react';

interface InterestItemProps {
  interest: string;
}

export default function InterestItem({ interest }: InterestItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
      <span className="text-slate-300">{interest}</span>
    </div>
  );
}
