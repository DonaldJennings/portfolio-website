'use client';
import React from 'react';

import BlogCard from '@/components/organisms/BlogCard';
import FilterBar from '@/components/organisms/FilterBar';

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
  excerpt?: string;
};

type BlogLandingPageProps = {
  posts: BlogPost[];
  tags?: string[];
  activeTag?: string;
  onTagSelect?: (tag: string) => void;
};

export default function BlogLandingPage({ posts, tags, activeTag }: BlogLandingPageProps) {
  const [search, setSearch] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | undefined>(activeTag);

  // Filter posts by tag and search
  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.description?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (post.excerpt?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 space-y-10 md:space-y-14">
      {/* Hero Section */}
      <section className="pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans">Developer Blog</h1>
        <p className="max-w-prose mx-auto text-lg opacity-80">
          Insights, architecture, and technical deep-dives from Donald Jennings.
        </p>
      </section>

      <div className="flex flex-row gap-10 items-start">
        {/* Combined Filter/Search Box */}
        <div className="min-w-[260px] max-w-[320px] flex flex-col justify-start">
          <div
            className="px-4 py-6 rounded-2xl border flex flex-col gap-4"
            style={{
              background: 'rgba(15,23,42,0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px 0 rgba(59,130,246,0.18), 0 0 0 1px rgba(34,197,94,0.10) inset',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none bg-slate-800 text-slate-100 placeholder:text-slate-400 shadow-sm focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)] transition-shadow"
              style={{ marginBottom: tags && tags.length > 0 ? '0.75rem' : 0 }}
            />
            {tags && tags.length > 0 && (
              <FilterBar
                tags={tags}
                activeTag={selectedTag}
                onTagSelect={tag => setSelectedTag(tag === selectedTag ? undefined : tag)}
                className="flex-wrap gap-2"
              />
            )}
          </div>
        </div>
        {/* Blog Cards Column */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            {filteredPosts.map(post => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
