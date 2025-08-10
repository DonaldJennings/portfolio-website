import MatrixRain from '@/components/organisms/MatrixRain';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import BlogPostPage from '@/components/pages/BlogPostPage';
import { compileMdx } from '@/lib/compileMDX';

export function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: { slug: string } }) {
  // Await params in case it's a Promise (App Router best practice)
  const resolvedParams = await params;
  const { content, meta } = getDevBlogPost(resolvedParams.slug);

  // Compile MDX content for rendering (make sure your .mdx files are valid)
  const compiledMdx = await compileMdx(content);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 py-20">
        <BlogPostPage meta={meta}>{compiledMdx}</BlogPostPage>
      </div>
    </div>
  );
}
