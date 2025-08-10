import Link from 'next/link';
import CardHeader from '../molecules/CardHeader';
import Excerpt from '../molecules/Excerpt';
import Button from '../atoms/Button';
import { formatTitle } from '@/lib/formatTitle';

type BlogCardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
  excerpt?: string;
};

export default function BlogCard({
  slug,
  title,
  description,
  date,
  tags,
  author,
  excerpt,
}: BlogCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
      <CardHeader title={formatTitle(title)} date={date} tags={tags} author={author} />
      <Excerpt text={excerpt || description} />
      <div className="mt-4">
        <Link href={`/dev-blog/${slug}`}>
          <Button variant="primary">Read More</Button>
        </Link>
      </div>
    </div>
  );
}
