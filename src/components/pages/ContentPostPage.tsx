'use client';
import Link from 'next/link';
import ContentPostPageContents, { ContentsItem } from '../molecules/ContentPostPageContents';
import { useEffect, useRef, useState } from 'react';
import ContentPostHeader from '../organisms/ContentPostHeader';
import RadialGradientOverlay from '../atoms/RadialGradientOverlay';

type ContentPostPageProps = {
  meta: {
    title: string;
    date: string;
    parent: {
      title: string;
      slug: string;
      href: string;
    };
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

export default function ContentPostPage({ meta, children }: ContentPostPageProps) {
  // DOM-based TOC extraction
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<ContentsItem[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(
      contentRef.current.querySelectorAll('h1, h2, h3'),
    ) as HTMLHeadingElement[];
    const items: ContentsItem[] = headings.map((h, i) => {
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Mobile-only gradient overlay to hide matrix rain at bottom, only when at page end */}
      <div
        className="block md:hidden absolute left-0 right-0 bottom-0 h-24 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 0%, rgba(15,23,42,1) 100%)',
        }}
      />

      <RadialGradientOverlay />

      {/* Main Content Above Backgrounds */}
      <main className="w-full flex-1 font-sans transition-all relative z-10 px-4 md:px-12 lg:px-20 py-4 md:py-8 flex flex-col">
        {/* On mobile, remove all containers and backgrounds for flat design */}
        <div className="w-full mx-auto flex flex-col flex-1 transition-all">
          <div className="mt-20 md:mt-24">
            <ContentPostHeader
              title={meta.title}
              date={meta.date}
              tags={meta.tags}
              author={{
                name: meta.author?.name ?? '',
                avatarUrl: meta.author?.avatarUrl,
                readingTime: meta.author?.readingTime,
                linkedinUrl: 'https://www.linkedin.com/in/donald-jennings-675081191/',
                githubUrl: 'https://github.com/DonaldJennings/',
              }}
              excerpt={meta.excerpt}
              description={meta.description}
            />
          </div>
          <div className="flex flex-col md:flex-row">
            {/* Hide TOC unless on desktop/laptop (md+) */}
            <div className="hidden md:block md:sticky md:top-24 md:self-start md:h-fit md:max-w-[260px] lg:max-w-[320px]">
              <ContentPostPageContents toc={toc} />
            </div>
            <div className="flex-1 min-w-0" ref={contentRef}>
              <div className="rounded-xl bg-slate-900/80 shadow-xl border border-slate-800 px-4 md:px-10 py-8 w-full">
                <section
                  className="
                    mdx-content prose prose-invert max-w-none w-full
                    text-slate-200
                    prose-p:leading-relaxed prose-p:mb-3 prose-p:text-[1rem]
                    prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-12 prose-h1:mb-3 prose-h1:text-blue-400
                    prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-2 prose-h2:text-teal-400
                    prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-1.5 prose-h3:text-green-400
                    prose-ul:pl-5 prose-ul:mb-3 prose-ul:mt-0
                    prose-ol:pl-5 prose-ol:mb-3 prose-ol:mt-0
                    prose-li:mb-1
                    prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-green-300
                    prose-pre:bg-[#1e2433] prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:my-4
                    prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-300 prose-blockquote:my-4 prose-blockquote:not-italic
                    prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-100
                    prose-hr:border-slate-700 prose-hr:my-6
                    break-words blog-content-link-fade
                  "
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {children}
                </section>
              </div>
            </div>
          </div>
          <nav className="flex justify-between items-center mt-8 md:mt-12 px-0 sm:px-0">
            <Link
              href={meta.parent.href}
              className="text-teal-400 hover:text-teal-300 hover:underline text-base font-medium transition-colors duration-200"
            >
              ← Back to {meta.parent.title}
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
