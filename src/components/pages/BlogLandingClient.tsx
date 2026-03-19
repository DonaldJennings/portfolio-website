'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DevBlogMeta } from '@/lib/devblog';

type Props = { posts: DevBlogMeta[] };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TAG_PALETTE = [
  'from-teal-400/20 to-cyan-400/20 border-teal-500/30 text-teal-300',
  'from-blue-400/20 to-indigo-400/20 border-blue-500/30 text-blue-300',
  'from-purple-400/20 to-violet-400/20 border-purple-500/30 text-purple-300',
  'from-amber-400/20 to-orange-400/20 border-amber-500/30 text-amber-300',
  'from-green-400/20 to-emerald-400/20 border-green-500/30 text-green-300',
  'from-pink-400/20 to-rose-400/20 border-pink-500/30 text-pink-300',
];
function tagStyle(tag: string) {
  let n = 0;
  for (let i = 0; i < tag.length; i++) n += tag.charCodeAt(i);
  return TAG_PALETTE[n % TAG_PALETTE.length];
}

// ── Hero card for the featured/latest post ─────────────────────────────────────

function HeroCard({ post }: { post: DevBlogMeta }) {
  const href = `/blog/${post.slug}`;
  const excerpt = post.excerpt || post.description || '';

  return (
    <Link href={href} className="block group focus:outline-none" tabIndex={0}>
      <div
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 group-hover:shadow-[0_24px_64px_0_rgba(59,130,246,0.18)]"
        style={{ minHeight: '420px' }}
      >
        {/* Background */}
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(99,102,241,0.25) 50%, rgba(20,184,166,0.20) 100%)',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: post.image
              ? 'linear-gradient(to top, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.75) 45%, rgba(2,6,23,0.2) 100%)'
              : 'linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.5) 100%)',
          }}
        />

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(99,102,241,0.4)' }}
        />

        {/* "Latest" badge */}
        <div className="absolute top-6 left-6">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-600/80 text-white backdrop-blur-sm">
            Latest post
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 flex flex-col gap-3">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-gradient-to-r backdrop-blur-sm ${tagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight max-w-3xl group-hover:text-blue-100 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Meta + CTA */}
          <div className="flex items-center justify-between mt-1 flex-wrap gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              {post.author?.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author.avatarUrl} alt={post.author.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600" />
              )}
              {post.author?.name && <span className="text-slate-300 font-medium">{post.author.name}</span>}
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              {post.author?.readingTime && (
                <>
                  <span>·</span>
                  <span>{post.author.readingTime}</span>
                </>
              )}
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 group-hover:bg-blue-600/80 group-hover:border-blue-500/60 transition-all duration-300">
              Read article
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Regular post card ──────────────────────────────────────────────────────────

function PostCard({ post }: { post: DevBlogMeta }) {
  const href = `/blog/${post.slug}`;
  const excerpt = post.excerpt || post.description || '';

  return (
    <Link href={href} className="block group focus:outline-none h-full">
      <article
        className="h-full flex flex-col rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group-hover:-translate-y-1"
        style={{
          background: 'rgba(15,23,42,0.7)',
          borderColor: 'rgba(59,130,246,0.12)',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.3)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)')}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-slate-800 shrink-0">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(99,102,241,0.2) 100%)' }}
            >
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {/* Reading time pill */}
          {post.author?.readingTime && (
            <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-slate-300 backdrop-blur-sm border border-slate-700/60">
              {post.author.readingTime}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-gradient-to-r ${tagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-[10px] text-slate-500 self-center">+{post.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
              {excerpt}
            </p>
          )}

          {/* Footer meta */}
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-700/40 text-[11px] text-slate-500">
            {post.author?.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
            )}
            <span>{formatDate(post.date)}</span>
            <span className="ml-auto flex items-center gap-1 text-blue-400 font-medium group-hover:gap-1.5 transition-all">
              Read
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function BlogLandingClient({ posts }: Props) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap(p => p.tags ?? []))),
    [posts],
  );

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchesTag = !selectedTag || p.tags?.includes(selectedTag);
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false);
      return matchesTag && matchesSearch;
    });
  }, [posts, search, selectedTag]);

  const [hero, ...rest] = filtered;
  const isFiltering = !!search || !!selectedTag;

  return (
    <div className="min-h-screen w-full relative z-10 py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-10">

        {/* ── Header ── */}
        <div className="text-center space-y-3 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Donald Jennings</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Developer Blog</h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Insights, architecture deep-dives, and technical writing on systems, software, and research.
          </p>
          <p className="text-xs text-slate-600">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* ── Search + tag filter ── */}
        <div className="space-y-3">
          {/* Search */}
          <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          {/* Tag pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {allTags.map(tag => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(active ? undefined : tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      active
                        ? `bg-gradient-to-r border-opacity-60 ${tagStyle(tag)}`
                        : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(undefined)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
                >
                  clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-slate-500 text-sm">No articles match your search.</p>
            <button onClick={() => { setSearch(''); setSelectedTag(undefined); }} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero — always show the top result large */}
            {hero && <HeroCard post={hero} />}

            {/* Remaining posts grid */}
            {rest.length > 0 && (
              <div>
                {!isFiltering && rest.length > 0 && (
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
                    More articles
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {rest.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
