import MatrixRain from '@/components/organisms/MatrixRain';
import BlogLandingPage from '@/components/pages/BlogLandingPage';
import { getDevBlogPosts } from '@/lib/devblog';

export default async function DevBlogPage() {
  const rawPosts = await getDevBlogPosts();

  const posts = rawPosts.map(post => ({
    ...post,
    description: post.description ?? '', // Ensure description is always a string
  }));

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 py-20">
        <BlogLandingPage posts={posts} />
      </div>
    </div>
  );
}
