import { notFound } from 'next/navigation';
import ContentPostPage from '@/components/pages/ContentPostPage';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';

export async function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getDevBlogPost(slug);
  if (!post) notFound();
  const { content, meta } = post;

  const metaWithParent = {
    ...meta,
    parent: {
      title: 'Blog',
      slug: 'blog',
      href: '/blog',
    },
  };

  return (
    <div className="min-h-screen relative">
      <ContentPostPage meta={metaWithParent}>{content}</ContentPostPage>
    </div>
  );
}
