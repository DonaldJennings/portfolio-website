import MatrixRain from '@/components/organisms/MatrixRain';
import { getDevBlogPost, getDevBlogPosts } from '@/lib/devblog';

export function generateStaticParams() {
  const posts = getDevBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default function DevBlogPostPage({ params }: { params: { slug: string } }) {
  const { content, meta } = getDevBlogPost(params.slug);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 py-20">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {meta.title}
          </h1>
          {meta.date && (
            <p className="text-slate-400 text-sm mb-4">{new Date(meta.date).toDateString()}</p>
          )}
          {meta.tags && meta.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {meta.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </div>
  );
}
