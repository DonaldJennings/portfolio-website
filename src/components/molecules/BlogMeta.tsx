import SkillTag from '@/components/atoms/SkillTag';

type BlogMetaProps = {
  date: string;
  tags?: string[];
};

export default function BlogMeta({ date, tags }: BlogMetaProps) {
  return (
    <div className="flex items-center gap-4 mb-2 flex-wrap">
      <span className="text-sm text-slate-400">{date}</span>
      <div className="flex gap-2 flex-wrap">
        {tags?.map(tag => (
          <SkillTag key={tag} skill={tag} />
        ))}
      </div>
    </div>
  );
}
