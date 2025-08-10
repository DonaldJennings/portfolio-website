import MatrixRain from '@/components/organisms/MatrixRain';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';

export function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function DevBlogPostPage({ params }: { params: { slug: string } }) {
  const { content, meta } = getDevBlogPost(params.slug);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 py-20">
        <article className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">{meta.title}</h1>
          <div className="space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </div>
  );
}
