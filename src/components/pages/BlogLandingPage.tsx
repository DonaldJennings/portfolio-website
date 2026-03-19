import React from 'react';
import { getDevBlogPosts } from '@/lib/devblog';
import BlogLandingClient from './BlogLandingClient';

export default function BlogLandingPage() {
  const posts = getDevBlogPosts();
  return <BlogLandingClient posts={posts} />;
}
