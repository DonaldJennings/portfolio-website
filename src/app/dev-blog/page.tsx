'use client';

import React, { useState } from 'react';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Building Modern Web Applications with Next.js',
    excerpt:
      'Exploring the latest features in Next.js 14 and how they improve developer experience and application performance.',
    date: '2024-12-15',
    readTime: '5 min read',
    tags: ['Next.js', 'React', 'Web Development'],
    featured: true,
  },
  {
    id: 2,
    title: 'The Evolution of TypeScript in Enterprise Applications',
    excerpt:
      'How TypeScript has transformed large-scale application development and improved code maintainability.',
    date: '2024-12-10',
    readTime: '8 min read',
    tags: ['TypeScript', 'JavaScript', 'Enterprise'],
    featured: false,
  },
  {
    id: 3,
    title: 'Optimizing React Performance: Best Practices',
    excerpt:
      'A comprehensive guide to React optimization techniques including memoization, lazy loading, and bundle splitting.',
    date: '2024-12-05',
    readTime: '6 min read',
    tags: ['React', 'Performance', 'Optimization'],
    featured: false,
  },
  {
    id: 4,
    title: 'Microservices Architecture: Lessons Learned',
    excerpt:
      'Real-world insights from implementing microservices at scale and the challenges we overcame.',
    date: '2024-11-28',
    readTime: '10 min read',
    tags: ['Architecture', 'Microservices', 'Backend'],
    featured: false,
  },
  {
    id: 5,
    title: 'AI Integration in Modern Software Development',
    excerpt:
      'Exploring how AI tools are changing the software development landscape and improving productivity.',
    date: '2024-11-20',
    readTime: '7 min read',
    tags: ['AI', 'Development', 'Future Tech'],
    featured: false,
  },
];

export default function DevBlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags))).sort();

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="relative min-h-screen font-mono bg-slate-900">
      {/* Dark overlay for consistency with home page */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      />

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Dev Blog</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on software development and technology
          </p>
        </div>

        {/* Tag Filter */}
        <div className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Filter by Topic</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && !selectedTag && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Post</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    FEATURED
                  </span>
                  <span className="text-slate-400 text-sm">{featuredPost.date}</span>
                  <span className="text-slate-400 text-sm">•</span>
                  <span className="text-slate-400 text-sm">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedTag ? `Posts tagged "${selectedTag}"` : 'Recent Posts'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <article
                key={post.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden group hover:border-blue-500/50 transition-all hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3 text-sm text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-slate-300 mb-6">
              Subscribe to get notified about new blog posts and technical insights
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
