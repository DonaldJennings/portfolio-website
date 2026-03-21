import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

import Title from '../atoms/Title';
import TagList from '../molecules/TagList';
import MetaRow from '../molecules/MetaRow';
import ExcerptBlock from '../molecules/ExcerptBlock';

export interface ContentPostCardProps {
  href: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  excerpt?: string;
  image?: string;
  layoutId?: string;
}

const ContentPostCard: React.FC<ContentPostCardProps> = ({
  href,
  title,
  description,
  date,
  tags,
  author,
  excerpt,
  image,
  layoutId,
}) => {
  const [showFullExcerpt, setShowFullExcerpt] = React.useState(false);
  const [hoveredTag, setHoveredTag] = React.useState<string | null>(null);
  const excerptText = excerpt || description || '';
  const isTruncated = excerptText.length > 120 && !showFullExcerpt;

  return (
    <Link href={href} className="group no-underline">
      <motion.div
        layoutId={layoutId}
        className="relative rounded-xl border flex flex-row overflow-hidden transition-all duration-300 cursor-pointer w-full group theme-post-card"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: 'var(--post-shadow)',
          border: '1.5px solid var(--card-border)',
        }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 md:p-5 min-w-0">
          <Title>{title}</Title>
          <MetaRow date={date} author={author} />
          <ExcerptBlock
            excerptText={excerptText}
            isTruncated={isTruncated}
            showFullExcerpt={showFullExcerpt}
            onShowMore={() => setShowFullExcerpt(true)}
          />
          {tags && tags.length > 0 && (
            <TagList tags={tags} hoveredTag={hoveredTag} setHoveredTag={setHoveredTag} />
          )}
        </div>

        {/* Full-height image on the right */}
        {image && (
          <div className="relative hidden md:block flex-shrink-0 w-48 self-stretch">
            <Image
              src={image}
              alt={title}
              fill
              sizes="192px"
              className="object-cover"
              style={{ display: 'block' }}
            />
            {/* Subtle left-side fade so image blends into card */}
            <div
              className="absolute inset-y-0 left-0 w-8"
              style={{
                background:
                  'linear-gradient(to right, rgba(15,23,42,0.65) 0%, transparent 100%)',
              }}
            />
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default ContentPostCard;
