'use client';

import BlogGrid from '@/components/organisms/BlogGrid';
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

export default function BlogLandingPage({
  posts,
  tags,
  activeTag,
  onTagSelect,
}: BlogLandingPageProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 space-y-10 md:space-y-14">
      {/* Hero Section */}
      <section className="pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans">Developer Blog</h1>
        <p className="max-w-prose mx-auto text-lg opacity-80">
          Insights, architecture, and technical deep-dives from Donald Jennings.
        </p>
      </section>

      {/* Filter Bar */}
      {tags && tags.length > 0 && (
        <FilterBar
          tags={tags}
          activeTag={activeTag}
          onTagSelect={onTagSelect}
          className="sticky top-16 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-3"
        />
      )}

      {/* Blog Grid */}
      <BlogGrid posts={posts} />
    </div>
  );
}
