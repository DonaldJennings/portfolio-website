'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

export default function ProjectCard({ project, featured = false }: { project: ProjectMeta; featured?: boolean }) {
  const year = project.date ? new Date(project.date).getFullYear() : null;
  const displayStack = project.stack?.slice(0, 4) ?? project.tags?.slice(0, 4) ?? [];

  return (
    <Link href={`/projects/${project.slug}`} className="group block no-underline h-full">
      <motion.div
        className="relative rounded-xl overflow-hidden h-full flex flex-col cursor-pointer theme-card"
        style={{
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          borderColor: 'var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.35 }}
      >
        {/* Image area */}
        <div className={`relative w-full flex-shrink-0 overflow-hidden bg-slate-900 ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}>
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes={featured ? '(max-width:768px) 100vw, 1200px' : '(max-width:768px) 100vw, 400px'}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 30%, rgba(10,15,30,0.92) 100%)',
            }}
          />
          {/* Status badge — top right */}
          {project.status && (
            <span
              className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${STATUS_STYLES[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </span>
          )}
          {/* Title + description over the gradient */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-6">
            <h3 className="text-base font-bold text-white leading-snug mb-1 group-hover:text-blue-300 transition-colors">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{project.description}</p>
            )}
          </div>
        </div>

        {/* Bottom content strip */}
        <div className="flex flex-col gap-3 px-4 py-3 flex-1">
          {/* Stack tags */}
          {displayStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displayStack.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                >
                  {tag}
                </span>
              ))}
              {(project.stack ?? project.tags ?? []).length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-500">
                  +{(project.stack ?? project.tags ?? []).length - 4}
                </span>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between mt-auto">
            {year && <span className="text-xs text-slate-500">{year}</span>}
            <div className="flex gap-2 ml-auto">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-700/60"
                  aria-label="View source on GitHub"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-teal-900/30"
                  aria-label="View live demo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
