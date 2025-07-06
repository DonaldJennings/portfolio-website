import React from 'react';
import PublicationItem from '@/components/atoms/PublicationItem';

const publications = [
  {
    title: 'Near-Storage Processing in FaaS environments with Funclets',
    authors: 'Alan Nair, Raven Szewczyk, Donald Jennings, Antonio Barbalace',
    venue: 'ACM Digital Library',
    year: '2024',
    url: 'http://dl.acm.org/doi/10.1145/3652892.3700755',
    doi: '10.1145/3652892.3700755',
  },
  {
    title:
      'Breaking the monolith: Dynamic multi-tiered load balancing for scalable serverless computing',
    authors: 'Donald Jennings',
    venue: 'University of Edinburgh Undergraduate Dissertation',
    year: '2024',
    url: 'https://drive.google.com/file/d/11ZHiQSHvoXia47pfWY72DMCQYCDeXCyN/view?usp=drive_link',
    doi: 'N/A',
  },
];

export default function PublicationsSection() {
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
