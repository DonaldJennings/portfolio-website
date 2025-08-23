import ContentPostPage from '@/components/pages/ContentPostPage';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';
import { compileMdx } from '@/lib/compileMDX';

export async function generateStaticParams() {
  const posts = await getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function DevBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta } = await getDevBlogPost(slug);
  const compiledMdx = await compileMdx(content);

  // Add the required parent property to meta
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
