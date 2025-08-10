type BlogMetaProps = {
  date: string;
  tags?: string[];
};

export default function BlogMeta({ date, tags }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#94a3b8] mb-2">
      <span>{date}</span>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 ml-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="border border-[#38b2ac] text-[#38b2ac] px-2 py-0.5 rounded-full text-xs font-medium bg-transparent transition-colors duration-200 hover:bg-[#38b2ac]/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
