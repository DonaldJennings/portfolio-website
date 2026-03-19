import React from 'react';
import PublicationItem from '@/components/atoms/PublicationItem';
import type { PublicationEntry } from '@/lib/admin/contentStore';

type PublicationsSectionProps = {
  publications: PublicationEntry[];
};

export default function PublicationsSection({ publications }: PublicationsSectionProps) {
  if (publications.length === 0) {
    return <p className="text-slate-500 text-sm">No publications yet.</p>;
  }

  return (
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
  );
}
