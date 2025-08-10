import Link from 'next/link';

export default function BlogCard({
  slug,
  title,
  description,
  date,
  tags,
  author,
  excerpt,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  excerpt?: string;
}) {
  return (
    <Link href={`/blog/${slug}`} className="group" style={{ textDecoration: 'none' }}>
      <div
        className="rounded-2xl border flex flex-col h-full p-6 md:p-7 transition-all duration-300 cursor-pointer"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 1px 8px 0 rgba(34,197,94,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow =
            '0 4px 24px 0 rgba(34,197,94,0.25), 0 0 0 1px rgba(255,255,255,0.08) inset';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow =
            '0 1px 8px 0 rgba(34,197,94,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset';
        }}
      >
        {/* Title */}
        <h2 className="text-xl font-bold mt-1 mb-2 line-clamp-2">{title}</h2>
        {/* Meta row */}
        <div className="mb-2 text-sm opacity-70 flex flex-wrap gap-2">
          <span>{date}</span>
          {author?.name && <span>· {author.name}</span>}
          {author?.readingTime && <span>· {author.readingTime}</span>}
        </div>
        {/* Excerpt */}
        <p
          className="mt-2 line-clamp-2"
          style={{
            color: 'rgba(226,232,240,0.9)',
            lineHeight: '1.7',
          }}
        >
          {excerpt || description}
        </p>
        {/* Tags row */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => {
              let borderColor = 'rgba(100,116,139,0.5)';
              const textColor = 'rgba(148,163,184,0.8)';
              let glow = '';
              if (tag.toLowerCase().includes('serverless')) {
                borderColor = 'rgba(34,197,94,0.7)';
                glow = '0 0 8px 2px rgba(34,197,94,0.25)';
              } else if (tag.toLowerCase().includes('architecture')) {
                borderColor = 'rgba(59,130,246,0.7)';
                glow = '0 0 8px 2px rgba(59,130,246,0.18)';
              }
              return (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 bg-transparent transition-all"
                  style={{
                    fontSize: '0.75rem',
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    boxShadow: glow,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = glow
                      ? glow
                      : '0 0 8px 2px rgba(148,163,184,0.18)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = glow;
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        {/* Spacer */}
        <div className="flex-1" />
        {/* CTA Arrow (for visual cue) */}
        <div className="flex justify-end mt-4">
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-2"
            style={{ marginRight: '4px' }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ verticalAlign: 'middle', transform: 'translateX(0)' }}
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
