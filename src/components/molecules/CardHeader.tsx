import BlogMeta from './BlogMeta';
import AuthorMeta from './AuthorMeta';

type CardHeaderProps = {
  title: string;
  date: string;
  tags?: string[];
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
};

export default function CardHeader({ title, date, tags, author }: CardHeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="text-2xl font-semibold text-white mb-1">{title}</h2>
      <BlogMeta date={date} tags={tags} />
      {author && (
        <AuthorMeta
          name={author.name}
          avatarUrl={author.avatarUrl}
          readingTime={author.readingTime}
        />
      )}
    </div>
  );
}
