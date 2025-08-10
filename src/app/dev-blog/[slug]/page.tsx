import BlogPostPage from '@/components/pages/BlogPostPage';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import { compileMdx } from '@/lib/compileMDX';

export async function generateStaticParams() {
  const posts = await getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: { slug: string } }) {
  const { content, meta } = await getDevBlogPost(params.slug);
  const compiledMdx = await compileMdx(content);

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 py-20">
        <BlogPostPage meta={meta}>{compiledMdx}</BlogPostPage>
      </div>
    </div>
  );
}
