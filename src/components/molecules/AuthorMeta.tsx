import Avatar from '@/components/atoms/Avatar';

type AuthorMetaProps = {
  name: string;
  avatarUrl?: string;
  readingTime?: string;
  role?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  className?: string;
};

export default function AuthorMeta({
  name,
  avatarUrl,
  readingTime,
  role,
  linkedinUrl,
  githubUrl,
  className,
}: AuthorMetaProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 rounded-lg border border-slate-800 shadow p-3 md:p-4 mt-4 w-fit max-w-xs md:max-w-sm lg:max-w-xs xl:max-w-xs ${
        className ?? ''
      }`}
    >
      <Avatar src={avatarUrl} size={48} alt={name} />
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-base font-semibold text-slate-200">{name}</span>
        {readingTime && <span className="text-xs text-slate-400 mt-1">{readingTime}</span>}
        {typeof role === 'string' && role && (
          <span className="text-xs text-teal-400 mt-1">{role}</span>
        )}
        <div className="flex gap-2 mt-2">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-teal-400"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" />
              </svg>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-teal-400"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.234 1.911 1.234 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
