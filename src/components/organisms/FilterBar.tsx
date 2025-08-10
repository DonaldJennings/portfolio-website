type FilterBarProps = {
  tags: string[];
  activeTag?: string;
  onTagSelect?: (tag: string) => void;
  className?: string;
};

export default function FilterBar({ tags, activeTag, onTagSelect, className }: FilterBarProps) {
  return (
    <div className={`flex flex-wrap gap-2 overflow-x-auto ${className || ''}`}>
      {tags.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => onTagSelect?.(tag)}
          className={`text-sm md:text-xs rounded-full border px-3 py-1.5 transition
            ${
              activeTag === tag
                ? 'border-teal-500 text-teal-600 bg-teal-50'
                : 'border-slate-300 text-slate-600 bg-transparent hover:border-teal-400 hover:text-teal-500'
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
