import BlogLandingPage from '@/components/pages/BlogLandingPage';
import { getDevBlogPosts } from '@/lib/devblog';

export default async function DevBlogPage() {
  const rawPosts = await getDevBlogPosts();

  const posts = rawPosts.map(post => ({
    ...post,
    description: post.description ?? '', // Ensure description is always a string
  }));

  // Aggregate all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags ?? [])));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Rain Background (higher opacity) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Increase opacity for more visual texture */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              opacity: 0.6,
              position: 'absolute',
              inset: 0,
            }}
          >
            {/* MatrixRainGlobal renders the animated effect */}
            {/* @ts-expect-error */}
            <div id="matrix-rain-global" />
          </div>
        </div>
        {/* Radial Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(59,130,246,0.18) 0%, rgba(15,23,42,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* Main Content Above Backgrounds */}
      <div className="relative z-10 py-20">
        <BlogLandingPage posts={posts} tags={allTags} />
      </div>
    </div>
  );
}
