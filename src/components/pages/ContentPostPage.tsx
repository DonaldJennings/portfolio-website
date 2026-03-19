'use client';
import Link from 'next/link';
import RadialGradientOverlay from '../atoms/RadialGradientOverlay';
import BlogPostInner from './BlogPostInner';

type ContentPostPageProps = {
  meta: {
    title: string;
    date: string;
    parent: { title: string; slug: string; href: string };
    tags?: string[];
    image?: string;
    author?: { name: string; avatarUrl?: string; readingTime?: string };
    excerpt?: string;
    description?: string;
  };
  children: React.ReactNode;
};

export default function ContentPostPage({ meta, children }: ContentPostPageProps) {
  return (
    <div className="min-h-screen relative">
      <RadialGradientOverlay />
      <div className="relative z-10 pt-20">
        {/* Back link */}
        <div className="max-w-3xl mx-auto px-4 pt-6">
          <Link
            href={meta.parent.href}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {meta.parent.title}
          </Link>
        </div>

        <BlogPostInner meta={meta}>{children}</BlogPostInner>
      </div>
    </div>
  );
}
