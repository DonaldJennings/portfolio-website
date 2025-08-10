'use client';
import Link from 'next/link';
import BlogTOC, { TOCItem } from '../molecules/BlogTOC';
import { useEffect, useRef, useState } from 'react';
import BlogHeader from '../organisms/BlogHeader';
import BlogBody from '../organisms/BlogBody';

type BlogPostPageProps = {
  meta: {
    title: string;
    date: string;
    tags?: string[];
    author?: {
      name: string;
      avatarUrl?: string;
      readingTime?: string;
    };
    excerpt?: string;
    description?: string;
  };
  children: React.ReactNode;
};

export default function BlogPostPage({ meta, children }: BlogPostPageProps) {
  // DOM-based TOC extraction
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(
      contentRef.current.querySelectorAll('h1, h2, h3'),
    ) as HTMLHeadingElement[];
    const items: TOCItem[] = headings.map((h, i) => {
      // Ensure heading has an ID
      if (!h.id) {
        h.id = `heading-${h.tagName.toLowerCase()}-${i}`;
      }
      // Add scroll margin for sticky header offset
      h.style.scrollMarginTop = '96px';
      return {
        id: h.id,
        text: h.textContent || '',
        level: parseInt(h.tagName[1]),
      };
    });
    setToc(items);
  }, [children]);

  return (
    <main className="w-full max-w-[1920px] mx-auto px-12 md:px-32 my-10 font-sans transition-all">
      <div
        className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl p-8 md:p-16 transition-all"
        style={{
          boxShadow: '0 4px 32px 0 rgba(34,197,94,0.16), 0 0 0 1px rgba(255,255,255,0.10) inset',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <BlogHeader
          title={meta.title}
          date={meta.date}
          tags={meta.tags}
          author={{
            ...meta.author,
            linkedinUrl: 'https://www.linkedin.com/in/donald-jennings-675081191/',
            githubUrl: 'https://github.com/DonaldJennings/',
          }}
          excerpt={meta.excerpt}
          description={meta.description}
        />
        <div className="flex flex-row">
          <BlogTOC toc={toc} />
          <div className="flex-1 min-w-0" ref={contentRef}>
            <BlogBody>
              <section
                className="
                  mdx-content
                  prose
                  prose-invert
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-blue-400 prose-h1:underline prose-h1:decoration-2 prose-h1:decoration-blue-400
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-teal-400 prose-h2:underline prose-h2:decoration-2 prose-h2:decoration-teal-400
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-green-400 prose-h3:underline prose-h3:decoration-2 prose-h3:decoration-green-400
                  prose-p:text-[1.08rem] prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-justify
                  prose-ul:mb-6 prose-ul:pl-6
                  prose-li:mb-2
                  prose-code:bg-[#23272e] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                  prose-pre:bg-[#23272e] prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:font-mono
                  prose-blockquote:border-l-4 prose-blockquote:border-teal-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-[#23272e] prose-blockquote:my-8
                  w-full
                  text-[#e5e7eb]
                  space-y-8
                  blog-content-link-fade
                "
                style={{
                  maxWidth: '100%',
                }}
              >
                {children}
              </section>
            </BlogBody>
          </div>
        </div>
        <nav className="flex justify-between items-center mt-12">
          <Link
            href="/dev-blog"
            className="text-teal-400 hover:text-teal-300 hover:underline text-base font-medium transition-colors duration-200"
          >
            ← Back to Blog
          </Link>
        </nav>
      </div>
    </main>
  );
}
