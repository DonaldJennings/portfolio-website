'use client';
import React from 'react';
import PageHeader from '../atoms/PageHeader';
import ContentFilter from '../molecules/ContentFilter';
import ContentCardsColumn from '../molecules/ContentCardsColumn';

export type ContentPostProps = {
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

type ContentLandingPageProps = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  baseContentPath: string;
  posts: ContentPostProps[];
  tags?: string[];
  activeTag?: string;
  onTagSelect?: (tag: string) => void;
};

export default function ContentLandingPage({
  title: pageTitle,
  subtitle: pageSubtitle,
  searchPlaceholder = 'Search posts...',
  posts,
  tags,
  baseContentPath,
  activeTag,
}: ContentLandingPageProps) {
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
    <div className="min-h-screen w-full overflow-hidden relative z-10 py-20">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8 space-y-8 md:space-y-14">
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          align="center"
          className="mb-8 pt-8 pb-4 text-center"
        />

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch md:items-start">
          {/* Combined Filter/Search Box */}
          <div className="w-full md:min-w-[260px] md:max-w-[320px] flex flex-col justify-start mb-6 md:mb-0">
            <ContentFilter
              search={search}
              searchPlaceholder={searchPlaceholder}
              setSearch={setSearch}
              tags={tags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          </div>
          {/* Blog Cards Column */}
          <ContentCardsColumn basePath={baseContentPath} filteredPosts={filteredPosts} />
        </div>
      </div>
    </div>
  );
}
