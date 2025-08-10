import BlogMeta from '../molecules/BlogMeta';
import AuthorMeta from '../molecules/AuthorMeta';

type BlogHeaderProps = {
  title: string;
  date: string;
  tags?: string[];
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
  excerpt?: string;
  description?: string;
};

export default function BlogHeader({
  title,
  date,
  tags,
  author,
  excerpt,
  description,
}: BlogHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold text-blue-300 mb-2">{title}</h1>
      <BlogMeta date={date} tags={tags} />
      {author && <AuthorMeta {...author} />}
      {excerpt && <p className="text-slate-400 mt-4">{excerpt}</p>}
      {!excerpt && description && <p className="text-slate-400 mt-4">{description}</p>}
    </header>
  );
}
