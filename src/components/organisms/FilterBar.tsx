type FilterBarProps = {
  tags: string[];
  activeTag?: string;
  onTagSelect?: (tag: string) => void;
  className?: string;
};

export default function FilterBar({ tags, activeTag, onTagSelect, className }: FilterBarProps) {
  // Assign category-based colors
  const tagColors: Record<string, string> = {
    serverless: 'from-green-400 to-teal-500',
    architecture: 'from-blue-400 to-blue-600',
    faasm: 'from-purple-400 to-purple-600',
    'distributed-systems': 'from-pink-400 to-pink-600',
    typescript: 'from-cyan-400 to-cyan-600',
    mdx: 'from-yellow-400 to-yellow-600',
    nextjs: 'from-indigo-400 to-indigo-600',
    default: 'from-slate-700 to-slate-900',
  };

  return (
    <div className={`flex flex-wrap gap-2 overflow-x-auto ${className || ''}`}>
      {tags.map(tag => {
        const colorClass = tagColors[tag.toLowerCase()] || tagColors.default;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagSelect?.(tag)}
            className={`text-sm md:text-xs rounded-full border px-3 py-1.5 transition font-semibold
              ${
                activeTag === tag
                  ? `border-blue-400 text-white bg-gradient-to-r ${colorClass} shadow-lg`
                  : `border-slate-600 text-slate-100 bg-slate-800 hover:border-blue-400 hover:text-blue-200 hover:shadow-[0_0_8px_2px_rgba(59,130,246,0.18)]`
              }`}
            style={{
              textShadow:
                activeTag === tag ? '0 1px 8px rgba(59,130,246,0.3)' : '0 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
