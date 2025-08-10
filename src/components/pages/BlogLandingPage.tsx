'use client';

import { useState } from 'react';
import FilterBar from '@/components/organisms/FilterBar';
import BlogGrid from '@/components/organisms/BlogGrid';

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
};

export default function BlogLandingPage({ posts }: BlogLandingPageProps) {
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags ?? [])));
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Developer Blog</h1>
        <p className="text-slate-400 text-lg">
          Insights, tutorials, and updates from my journey as a developer.
          <br />
          <span className="text-slate-500 text-base">Powered by MDX, Next.js, and TypeScript.</span>
        </p>
      </header>
      <FilterBar tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
      <BlogGrid posts={filteredPosts} />
    </main>
  );
}
