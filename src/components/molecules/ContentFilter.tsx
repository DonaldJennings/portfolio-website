import FilterBar from '../organisms/FilterBar';

type ContentFilterProps = {
  search: string;
  searchPlaceholder: string;
  setSearch: (search: string) => void;
  tags?: string[];
  selectedTag?: string;
  setSelectedTag: (tag: string | undefined) => void;
};

export default function ContentFilter({
  search,
  searchPlaceholder,
  setSearch,
  tags,
  selectedTag,
  setSelectedTag,
}: ContentFilterProps) {
  return (
    <div
      className="px-3 py-5 md:px-4 md:py-6 rounded-2xl border flex flex-col gap-3 md:gap-4"
      style={{
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'var(--filter-shadow)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none bg-slate-800 text-slate-100 placeholder:text-slate-400 shadow-sm focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)] transition-shadow"
        style={{ marginBottom: tags && tags.length > 0 ? '0.75rem' : 0 }}
      />
      {tags && tags.length > 0 && (
        <FilterBar
          tags={tags}
          activeTag={selectedTag}
          onTagSelect={tag => setSelectedTag(tag === selectedTag ? undefined : tag)}
          className="flex-wrap gap-2"
        />
      )}
    </div>
  );
}
