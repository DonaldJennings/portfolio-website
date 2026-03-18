import React from 'react';
import PublicationItem from '@/components/atoms/PublicationItem';
import type { PublicationEntry } from '@/lib/admin/contentStore';

type PublicationsSectionProps = {
  publications: PublicationEntry[];
};

export default function PublicationsSection({ publications }: PublicationsSectionProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Publications</h2>
      <div className="space-y-4">
        {publications.map((publication, index) => (
          <PublicationItem
            key={index}
            title={publication.title}
            authors={publication.authors}
            venue={publication.venue}
            year={publication.year}
            url={publication.url}
            doi={publication.doi}
          />
        ))}
      </div>
    </div>
  );
}
