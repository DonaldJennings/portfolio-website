import BlogMeta from '../molecules/BlogMeta';
import AuthorMeta from '../molecules/AuthorMeta';

type ContentPostHeaderProps = {
  title: string;
  date: string;
  tags?: string[];
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
    role?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  excerpt?: string;
  description?: string;
};

export default function ContentPostHeader({
  title,
  date,
  tags,
  author,
  excerpt,
  description,
}: ContentPostHeaderProps) {
  return (
    <header
      className="w-full rounded-xl mb-6"
      style={{
        background: 'linear-gradient(90deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.65) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 2px 24px 0 rgba(34,197,94,0.12), 0 0 0 1px rgba(255,255,255,0.08) inset',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '1.75rem 2rem 1.5rem 2rem',
      }}
    >
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400"
        style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1.2 }}
      >
        {title}
      </h1>
      <BlogMeta date={date} tags={tags} className="text-xs sm:text-sm mb-2" />
      {(excerpt || description) && (
        <p className="text-slate-300 mt-2 text-base sm:text-lg leading-relaxed">
          {excerpt || description}
        </p>
      )}
      {author && (
        <div className="mt-3 pt-3 border-t border-slate-700/60">
          <AuthorMeta {...author} className="text-xs sm:text-sm" />
        </div>
      )}
    </header>
  );
}
