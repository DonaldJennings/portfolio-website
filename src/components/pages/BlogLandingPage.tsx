import React from 'react';
import { getDevBlogPosts } from '@/lib/devblog';
import ContentLandingPage from './ContentLandingPage';

export default async function BlogLandingPage() {
  const rawPosts = await getDevBlogPosts();

  const posts = rawPosts.map(post => ({
    ...post,
    description: post.description ?? '', // Ensure description is always a string
  }));

  // Aggregate all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags ?? [])));

  return (
    <ContentLandingPage
      title="Developer Blog"
      subtitle="Insights, architecture, and technical deep-dives from Donald Jennings."
      searchPlaceholder="Search blog posts..."
      baseContentPath="/blog"
      posts={posts}
      tags={allTags}
    />
  );
}
