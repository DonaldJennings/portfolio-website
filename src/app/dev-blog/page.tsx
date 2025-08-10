import BlogLandingPage from '@/components/pages/BlogLandingPage';
import { getDevBlogPosts } from '@/lib/devblog';

export default async function DevBlogPage() {
  const rawPosts = await getDevBlogPosts();

  const posts = rawPosts.map(post => ({
    ...post,
    description: post.description ?? '', // Ensure description is always a string
  }));

  return (
    <div className="min-h-screen relative">
      {/* No MatrixRain or bg-black here; global background and rain are handled in layout.tsx */}
      <div className="relative z-10 py-20">
        <BlogLandingPage posts={posts} />
      </div>
    </div>
  );
}
