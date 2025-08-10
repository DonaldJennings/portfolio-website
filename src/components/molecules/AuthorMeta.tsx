import Avatar from '@/components/atoms/Avatar';
import Icon from '@/components/atoms/Icon';

type AuthorMetaProps = {
  name: string;
  avatarUrl?: string;
  readingTime?: string;
};

export default function AuthorMeta({ name, avatarUrl, readingTime }: AuthorMetaProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Avatar src={avatarUrl} size={24} alt={name} />
      <span className="ml-1">{name}</span>
      {readingTime && (
        <>
          <span className="mx-1">·</span>
          <Icon name="calendar" size={16} className="inline-block mr-1" />
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
