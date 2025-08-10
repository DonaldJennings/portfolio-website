import BlogCard from './BlogCard';
import { LayoutGroup } from 'framer-motion';

type BlogGridProps = {
  posts: Array<{
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
  }>;
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 py-8">
        {posts.map(post => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </LayoutGroup>
  );
}
