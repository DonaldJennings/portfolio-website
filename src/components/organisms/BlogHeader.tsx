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
      <h1 className="text-4xl font-bold text-[#f9fafb] mb-2 font-sans">{title}</h1>
      <BlogMeta date={date} tags={tags} />
      {author && <AuthorMeta {...author} />}
      {excerpt && <p className="text-[#94a3b8] mt-4 text-lg">{excerpt}</p>}
      {!excerpt && description && <p className="text-[#94a3b8] mt-4 text-lg">{description}</p>}
    </header>
  );
}
