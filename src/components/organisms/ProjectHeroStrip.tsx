import { ProjectMeta } from '@/lib/projects';

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-green-500/20 text-green-400 border border-green-500/40',
  wip: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
  archived: 'bg-slate-500/20 text-slate-400 border border-slate-500/40',
};

const STATUS_LABELS: Record<string, string> = {
  live: 'Live',
  wip: 'In Progress',
  archived: 'Archived',
};

const ROLE_LABELS: Record<string, string> = {
  solo: 'Solo project',
  team: 'Team project',
  contributor: 'Open-source contributor',
};

export default function ProjectHeroStrip({ meta }: { meta: ProjectMeta }) {
  return (
    <div
      className="w-full rounded-xl px-6 py-6 md:px-8 md:py-7"
      style={{
        background: 'linear-gradient(90deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.75) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid var(--strip-border)',
        boxShadow: 'var(--strip-shadow)',
      }}
    >
      {/* Title row */}
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 leading-tight"
          style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
        >
          {meta.title}
        </h1>
        {meta.status && (
          <span className={`self-center text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[meta.status]}`}>
            {STATUS_LABELS[meta.status]}
          </span>
        )}
      </div>

      {/* Description */}
      {meta.description && (
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">{meta.description}</p>
      )}

      {/* CTA buttons */}
      {(meta.repoUrl || meta.demoUrl) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {meta.repoUrl && (
            <a
              href={meta.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-700/80 hover:bg-slate-600/80 text-slate-100 border border-slate-600 hover:border-slate-500 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          )}
          {meta.demoUrl && (
            <a
              href={meta.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-600/40 hover:border-teal-500/60 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Stack badges */}
      {meta.stack && meta.stack.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 mr-1">Stack:</span>
          {meta.stack.map(tech => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-full bg-blue-900/30 border border-blue-700/40 text-blue-300 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Role */}
      {meta.role && (
        <p className="text-xs text-slate-500 mt-3">{ROLE_LABELS[meta.role]}</p>
      )}
    </div>
  );
}
