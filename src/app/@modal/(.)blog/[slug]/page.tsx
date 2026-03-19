import { notFound } from 'next/navigation';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import { compileMdx } from '@/lib/compileMDX';
import ProjectOverlay from '@/components/organisms/ProjectOverlay';
import BlogPostInner from '@/components/pages/BlogPostInner';

export async function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function InterceptedBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getDevBlogPost(slug);
  if (!post) notFound();

  const compiled = post.content ? await compileMdx(post.content) : null;

  return (
    <ProjectOverlay>
      <BlogPostInner meta={post.meta}>{compiled}</BlogPostInner>
    </ProjectOverlay>
  );
}
