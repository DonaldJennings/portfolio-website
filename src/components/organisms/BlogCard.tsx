import Link from 'next/link';

export default function BlogCard({
  slug,
  title,
  description,
  date,
  tags,
  author,
  excerpt,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  excerpt?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white dark:bg-[#1f2937] shadow-sm hover:shadow-md transition p-6 md:p-7 flex flex-col h-full">
      {/* Title */}
      <h2 className="text-xl font-bold mt-1 line-clamp-2">{title}</h2>
      {/* Meta row */}
      <div className="mt-2 text-sm opacity-70 flex flex-wrap gap-2">
        <span>{date}</span>
        {author?.name && <span>· {author.name}</span>}
        {author?.readingTime && <span>· {author.readingTime}</span>}
      </div>
      {/* Excerpt */}
      <p className="mt-2 text-slate-500 line-clamp-2">{excerpt || description}</p>
      {/* Tags row */}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs rounded-full border px-2 py-0.5 border-slate-300 text-slate-600 bg-transparent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Spacer */}
      <div className="flex-1" />
      {/* CTA */}
      <div className="flex justify-end mt-4">
        <Link href={`/dev-blog/${slug}`}>
          <button className="text-teal-600 border border-teal-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-teal-50 transition">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}
