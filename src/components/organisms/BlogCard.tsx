import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function BlogCard({
  slug,
  title,
  description,
  date,
  tags,
  author,
  excerpt,
  image,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  excerpt?: string;
  image?: string;
}) {
  const [showFullExcerpt, setShowFullExcerpt] = React.useState(false);
  const excerptText = excerpt || description || '';
  const isTruncated = excerptText.length > 120 && !showFullExcerpt;

  return (
    <Link href={`/blog/${slug}`} className="group" style={{ textDecoration: 'none' }}>
      <motion.div
        layoutId={`blog-card-${slug}`}
        className="relative rounded-2xl border flex flex-col md:flex-row items-center p-5 md:p-8 transition-all duration-300 cursor-pointer w-full gap-6 md:gap-8 group"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 16px 0 rgba(59,130,246,0.12), 0 0 0 1px rgba(34,197,94,0.10) inset',
          border: '1.5px solid rgba(59,130,246,0.18)',
        }}
        whileHover={{
          y: -4,
          boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25), 0 0 0 2px rgba(34,197,94,0.18) inset',
        }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
      >
        {/* ...existing code... */}
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3 line-clamp-2 leading-tight">
            {title}
          </h2>
          {/* Meta row */}
          <div className="mb-4 text-sm opacity-70 flex flex-wrap gap-2">
            <span>{date}</span>
            {author?.name && <span>· {author.name}</span>}
            {author?.readingTime && <span>· {author.readingTime}</span>}
          </div>
          {/* Excerpt */}
          <p
            className={showFullExcerpt ? 'mt-2' : 'mt-2 line-clamp-2'}
            style={{
              color: 'rgba(236,240,245,0.96)',
              lineHeight: '1.8',
              fontSize: '1.08rem',
              maxWidth: '100%',
            }}
          >
            {excerptText}
            {isTruncated && !showFullExcerpt && (
              <span
                className="ml-2 text-teal-400 hover:underline cursor-pointer text-xs font-semibold"
                onClick={e => {
                  e.preventDefault();
                  setShowFullExcerpt(true);
                }}
              >
                Show more
              </span>
            )}
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
              className="inline-block transition-transform duration-300 group-hover:translate-x-4 group-hover:scale-110"
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
        {/* Optional Image on the right */}
        {image && (
          <div
            className="flex items-center justify-center"
            style={{ minWidth: '180px', width: '240px', height: '180px' }}
          >
            <div className="relative w-[220px] h-[160px]">
              <Image
                src={image}
                alt={title + ' image'}
                fill
                sizes="(max-width: 768px) 100vw, 220px"
                className="rounded-2xl object-cover shadow-xl border-2 border-blue-400"
                style={{ background: '#222' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
