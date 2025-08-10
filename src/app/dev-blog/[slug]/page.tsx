import BlogPostPage from '@/components/pages/BlogPostPage';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import { compileMdx } from '@/lib/compileMDX';

export function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: { slug: string } }) {
  const { content, meta } = getDevBlogPost(params.slug);
  const compiledMdx = await compileMdx(content);

  return (
    <div className="min-h-screen relative">
      {/* No MatrixRain here; it's globally rendered in layout.tsx */}
      <div className="relative z-10 py-20">
        <BlogPostPage meta={meta}>{compiledMdx}</BlogPostPage>
      </div>
    </div>
  );
}
