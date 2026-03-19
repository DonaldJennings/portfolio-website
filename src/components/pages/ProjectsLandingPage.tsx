'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ProjectMeta } from '@/lib/projects';
import ProjectCard from '../organisms/ProjectCard';
import PageHeader from '../atoms/PageHeader';

type ProjectsLandingPageProps = {
  projects: ProjectMeta[];
};

const TAG_COLORS: Record<string, string> = {
  serverless: 'from-green-400 to-teal-500',
  architecture: 'from-blue-400 to-blue-600',
  faasm: 'from-purple-400 to-purple-600',
  'distributed-systems': 'from-pink-400 to-pink-600',
  typescript: 'from-cyan-400 to-cyan-600',
  mdx: 'from-yellow-400 to-yellow-600',
  nextjs: 'from-indigo-400 to-indigo-600',
  default: 'from-slate-700 to-slate-900',
};

export default function ProjectsLandingPage({ projects }: ProjectsLandingPageProps) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags ?? [])));
  const allStack = Array.from(new Set(projects.flatMap(p => p.stack ?? [])));
  const allYears = Array.from(
    new Set(projects.map(p => new Date(p.date).getFullYear()))
  ).sort((a, b) => b - a);

  const filtered = projects.filter(p => {
    const matchesTag =
      !selectedTag ||
      (p.tags && p.tags.includes(selectedTag)) ||
      (p.stack && p.stack.includes(selectedTag));
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false) ||
      (p.stack?.some(s => s.toLowerCase().includes(q)) ?? false);
    const matchesYear = !selectedYear || new Date(p.date).getFullYear() === selectedYear;
    return matchesTag && matchesSearch && matchesYear;
  });

  const activeFilterCount = (selectedTag ? 1 : 0) + (selectedYear ? 1 : 0);
  const hasActiveFilters = !!search || activeFilterCount > 0;

  function clearAll() {
    setSearch('');
    setSelectedTag(undefined);
    setSelectedYear(undefined);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }
    if (filtersOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filtersOpen]);

  const featured = filtered.filter(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen w-full overflow-hidden relative z-10 py-20">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8 space-y-8">
        <PageHeader
          title="Projects"
          subtitle="A collection of my personal and professional projects."
          align="center"
          className="mb-4 pt-8 pb-2 text-center"
        />

        {/* Search bar + filter button */}
        <div className="flex items-center justify-center gap-2">
          {/* Search input */}
          <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter dropdown button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                  : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M13 16h-2" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
              <svg
                className={`w-3 h-3 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {filtersOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-sm shadow-2xl z-30 divide-y divide-slate-700/50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filters</span>
                  {hasActiveFilters && (
                    <button onClick={clearAll} className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
                      Clear all
                    </button>
                  )}
                </div>

                {/* Tech */}
                {allStack.length > 0 && (
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tech</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allStack.map(tag => {
                        const active = selectedTag === tag;
                        const colorClass = TAG_COLORS[tag.toLowerCase()] ?? TAG_COLORS.default;
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(active ? undefined : tag)}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                              active
                                ? `bg-gradient-to-r ${colorClass} border-blue-400 text-white shadow-sm`
                                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map(tag => {
                        const active = selectedTag === tag;
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(active ? undefined : tag)}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                              active
                                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-teal-500/40 hover:text-teal-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Year */}
                {allYears.length > 1 && (
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Year</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allYears.map(year => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(selectedYear === year ? undefined : year)}
                          className={`px-3 py-0.5 rounded-full text-xs font-medium border transition-all ${
                            selectedYear === year
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result count */}
          <span className="text-xs text-slate-500 tabular-nums hidden sm:block">
            {filtered.length} / {projects.length}
          </span>
        </div>

        {/* Featured row */}
        {featured.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Featured</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map(p => (
                <ProjectCard key={p.slug} project={p} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular grid */}
        {regular.length > 0 ? (
          <div className={featured.length > 0 ? 'space-y-3' : ''}>
            {featured.length > 0 && (
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">All Projects</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regular.map(p => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        ) : (
          filtered.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-12">
              No projects match your filters.
            </p>
          )
        )}
      </div>
    </div>
  );
}
