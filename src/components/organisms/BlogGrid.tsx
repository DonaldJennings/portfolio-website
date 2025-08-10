import BlogCard from './BlogCard';

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
    <div className="grid gap-8 md:grid-cols-2">
      {posts.map(post => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
