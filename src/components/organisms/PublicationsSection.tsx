'use client';

import React, { useEffect, useState } from 'react';
import PublicationItem from '@/components/atoms/PublicationItem';

type PublicationEntry = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
  doi?: string;
};

export default function PublicationsSection() {
  const [publications, setPublications] = useState<PublicationEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/publications')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setPublications(data.publications || []);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      mounted = false;
    };
  }, []);

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
