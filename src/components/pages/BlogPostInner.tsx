'use client';
import { useEffect, useRef, useState } from 'react';

type Meta = {
  title: string;
  date: string;
  tags?: string[];
  image?: string;
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  excerpt?: string;
  description?: string;
};

type Props = { meta: Meta; children: React.ReactNode };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

type TocItem = { id: string; text: string; level: number };

function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Contents</p>
      {toc.map(item => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`block w-full text-left text-xs py-0.5 transition-colors leading-snug ${
            item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-3' : 'pl-6'
          } ${
            active === item.id
              ? 'text-teal-400 font-medium'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {active === item.id && (
            <span className="inline-block w-1 h-1 rounded-full bg-teal-400 mr-1.5 mb-0.5" />
          )}
          {item.text}
        </button>
      ))}
    </nav>
  );
}

export default function BlogPostInner({ meta, children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h1,h2,h3')) as HTMLHeadingElement[];
    setToc(headings.map((h, i) => {
      if (!h.id) h.id = `h-${i}`;
      h.style.scrollMarginTop = '88px';
      return { id: h.id, text: h.textContent ?? '', level: parseInt(h.tagName[1]) };
    }));
  }, [children]);

  const blurb = meta.excerpt || meta.description;

  return (
    <article className="w-full">
      {/* ── Header ── */}
      <header className="max-w-4xl mx-auto px-6 md:px-10 pt-6 pb-8 space-y-5">
        {/* Tags */}
        {meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-teal-500/30 bg-teal-500/10 text-teal-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
          {meta.title}
        </h1>

        {/* Blurb */}
        {blurb && (
          <p className="text-lg text-slate-400 leading-relaxed">
            {blurb}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          {meta.author?.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.author.avatarUrl}
              alt={meta.author.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
            />
          )}
          {meta.author?.name && (
            <span className="text-slate-300 font-medium">{meta.author.name}</span>
          )}
          {meta.author?.name && <span>·</span>}
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          {meta.author?.readingTime && (
            <>
              <span>·</span>
              <span>{meta.author.readingTime}</span>
            </>
          )}
        </div>
      </header>

      {/* ── Cover image ── */}
      {meta.image && (
        <div className="max-w-4xl mx-auto px-6 md:px-10 pb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.image}
            alt={meta.title}
            className="w-full rounded-2xl object-cover max-h-80"
            style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.4)' }}
          />
        </div>
      )}

      {/* ── Divider ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pb-8">
        <div className="border-t border-slate-700/50" />
      </div>

      {/* ── Body: TOC + content ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12 flex gap-12 items-start">

        {/* TOC sidebar */}
        {toc.length > 1 && (
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24 self-start">
            <div
              className="rounded-xl p-4 border border-slate-700/50"
              style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
            >
              <TableOfContents toc={toc} />
            </div>
          </aside>
        )}

        {/* Prose */}
        <div className="flex-1 min-w-0" ref={contentRef}>
          <div className="mdx-content">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
