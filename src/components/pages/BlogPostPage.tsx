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
    <main className="max-w-3xl mx-auto px-4 py-12">
      <BlogHeader
        title={meta.title}
        date={meta.date}
        tags={meta.tags}
        author={meta.author}
        excerpt={meta.excerpt}
        description={meta.description}
      />
      <BlogBody>{children}</BlogBody>
    </main>
  );
}
