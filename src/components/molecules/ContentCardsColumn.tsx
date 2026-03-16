import ContentPostCard from '../organisms/ContentPostCard';
import { ContentPostProps } from '../pages/ContentLandingPage';

type ContentCardsColumnProps = {
  basePath?: string;
  filteredPosts: ContentPostProps[];
};

export default function ContentCardsColumn({ filteredPosts, basePath }: ContentCardsColumnProps) {
  return (
    <div className="w-full md:flex-1 flex flex-col justify-start">
      <div className="w-full flex flex-col gap-3 md:gap-4">
        {filteredPosts.map(post => (
          <ContentPostCard href={`${basePath}/${post.slug}`} key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
