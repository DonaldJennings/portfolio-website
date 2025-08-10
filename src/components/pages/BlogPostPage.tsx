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
  return (
    <main
      className="
        w-full
        max-w-6xl
        mx-auto
        bg-[#1f2937]
        rounded-xl
        border border-[#2d3748]
        shadow-md
        px-4 sm:px-8 md:px-16 lg:px-24
        py-8 md:py-12
        my-10
        font-sans
        transition-all
      "
      style={{
        color: '#f9fafb',
        fontFamily: 'Inter, IBM Plex Sans, Source Sans Pro, sans-serif',
        fontSize: '18px',
        lineHeight: '1.7',
      }}
    >
      <BlogHeader
        title={meta.title}
        date={meta.date}
        tags={meta.tags}
        author={meta.author}
        excerpt={meta.excerpt}
        description={meta.description}
      />
      <hr className="my-8 border-[#374151]" />
      <BlogBody>
        <section
          className="
            mdx-content
            prose
            prose-invert
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6
            prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-ul:mb-6 prose-ul:pl-6
            prose-li:mb-2
            prose-code:bg-[#23272e] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
            prose-pre:bg-[#23272e] prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:font-mono
            prose-blockquote:border-l-4 prose-blockquote:border-teal-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-[#23272e] prose-blockquote:my-8
            max-w-[65ch]
            text-[#e5e7eb]
            space-y-8
          "
        >
          {children}
        </section>
      </BlogBody>
      <nav className="flex justify-between items-center mt-12">
        <a
          href="/dev-blog"
          className="text-teal-400 hover:text-teal-300 hover:underline text-base font-medium transition-colors duration-200"
        >
          ← Back to Blog
        </a>
        {/* <a href="/dev-blog/next-post" className="text-teal-400 hover:text-teal-300 hover:underline text-base font-medium transition-colors duration-200">Next Article →</a> */}
      </nav>
    </main>
  );
}
