import React from 'react';

interface PublicationItemProps {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
  doi?: string;
}

export default function PublicationItem({
  title,
  authors,
  venue,
  year,
  url,
  doi,
}: PublicationItemProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg transition-all duration-300 hover:bg-slate-800/50 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/10 ${
        url ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-white mb-2 leading-tight">{title}</h3>

      <p className="text-slate-300 text-sm mb-2">{authors}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-blue-400 text-sm font-medium">
          {venue} ({year})
        </p>

        {(url || doi) && (
          <div className="flex items-center gap-3 text-xs">
            {doi && <span className="text-slate-400">DOI: {doi}</span>}
            {url && (
              <div className="flex items-center gap-1 text-cyan-400 group">
                <span>View Paper</span>
                <svg
                  className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
