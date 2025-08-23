import React from 'react';

interface MetaRowProps {
  date: string;
  author?: { name: string; readingTime?: string };
}

const MetaRow: React.FC<MetaRowProps> = ({ date, author }) => (
  <div className="mb-4 text-sm opacity-70 flex flex-wrap gap-2">
    <span>{date}</span>
    {author?.name && <span>· {author.name}</span>}
    {author?.readingTime && <span>· {author.readingTime}</span>}
  </div>
);

export default MetaRow;
