import MatrixRain from '@/components/organisms/MatrixRain';
import Link from 'next/link';
import { getDevBlogPosts } from '@/lib/devblog';

export default function DevBlogPage() {
  const posts = getDevBlogPosts();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Developer Blog
          </h1>
          <ul className="space-y-4">
            {posts.map(post => (
              <li
                key={post.slug}
                className="border border-slate-800 rounded-lg p-4 bg-slate-800/30 backdrop-blur-sm"
              >
                <Link
                  href={`/dev-blog/${post.slug}`}
                  className="text-xl text-green-400 hover:underline"
                >
                  {post.title}
                </Link>
                {post.date && (
                  <p className="text-slate-400 text-sm">{new Date(post.date).toDateString()}</p>
                )}
                {post.description && <p className="text-slate-300 mt-2">{post.description}</p>}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
