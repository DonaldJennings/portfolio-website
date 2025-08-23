'use client';
import Link from 'next/link';
import ContentPostPageContents, { ContentsItem } from '../molecules/ContentPostPageContents';
import { useEffect, useRef, useState } from 'react';
import ContentPostHeader from '../organisms/ContentPostHeader';
import ContentPostBody from '../organisms/ContentPostBody';
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
      <main className="w-full flex-1 font-sans transition-all relative z-10 px-4 md:px-32 py-4 md:py-10 flex flex-col">
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
            <div className="flex-1 min-w-0 flex" ref={contentRef}>
              <div className="rounded-2xl bg-slate-900/80 shadow-xl border border-slate-800 px-2 md:px-8 py-6 md:py-10 transition-all w-full min-h-full flex flex-col">
                <ContentPostBody>
                  <section
                    className="
                      mdx-content
                      prose
                      prose-invert
                      prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 md:prose-h1:mb-6 prose-h1:text-blue-400 prose-h1:underline prose-h1:decoration-2 prose-h1:decoration-blue-400
                      prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 md:prose-h2:mt-10 prose-h2:mb-3 md:prose-h2:mb-4 prose-h2:text-teal-400 prose-h2:underline prose-h2:decoration-2 prose-h2:decoration-teal-400
                      prose-h3:text-lg md:prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-2 md:prose-h3:mb-3 prose-h3:text-green-400 prose-h3:underline prose-h3:decoration-2 prose-h3:decoration-green-400
                      prose-p:text-[1rem] md:prose-p:text-[1.08rem] prose-p:leading-[1.75] prose-p:mb-4 md:prose-p:mb-6 prose-p:text-justify break-words whitespace-pre-line overflow-wrap break-word
                      prose-ul:mb-4 md:prose-ul:mb-6 prose-ul:pl-6
                      prose-li:mb-1 md:prose-li:mb-2
                      prose-code:bg-[#23272e] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                      prose-pre:bg-[#23272e] prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:font-mono
                      prose-blockquote:border-l-4 prose-blockquote:border-teal-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-[#23272e] prose-blockquote:my-6 md:prose-blockquote:my-8
                      w-full
                      text-[#e5e7eb]
                      space-y-6 md:space-y-8
                      blog-content-link-fade
                      px-2 md:px-0
                    "
                    style={{
                      maxWidth: '100%',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {children}
                  </section>
                </ContentPostBody>
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
