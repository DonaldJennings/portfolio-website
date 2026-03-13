import ContentPostPage from '@/components/pages/ContentPostPage';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import { compileMdx } from '@/lib/compileMDX';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta } = await getDevBlogPost(slug);
  const compiledMdx = await compileMdx(content);

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
      <ContentPostPage meta={metaWithParent}>{compiledMdx}</ContentPostPage>
    </div>
  );
}
