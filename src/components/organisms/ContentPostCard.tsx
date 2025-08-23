import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

import Title from '../atoms/Title';
import TagList from '../molecules/TagList';
import MetaRow from '../molecules/MetaRow';
import ExcerptBlock from '../molecules/ExcerptBlock';
import CTAArrow from '../atoms/CTAArrow';
import CardImage from '../atoms/CardImage';

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
        className="relative rounded-2xl border flex flex-col md:flex-row items-center p-5 md:p-8 transition-all duration-300 cursor-pointer w-full gap-6 md:gap-8 group"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 16px 0 rgba(59,130,246,0.12), 0 0 0 1px rgba(34,197,94,0.10) inset',
          border: '1.5px solid rgba(59,130,246,0.18)',
        }}
        whileHover={{
          y: -4,
          boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25), 0 0 0 2px rgba(34,197,94,0.18) inset',
        }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <Title>{title}</Title>
          {/* Meta row */}
          <MetaRow date={date} author={author} />
          {/* Excerpt */}
          <ExcerptBlock
            excerptText={excerptText}
            isTruncated={isTruncated}
            showFullExcerpt={showFullExcerpt}
            onShowMore={() => setShowFullExcerpt(true)}
          />
          {/* Tags row */}
          {tags && tags.length > 0 && (
            <TagList tags={tags} hoveredTag={hoveredTag} setHoveredTag={setHoveredTag} />
          )}
          {/* Spacer */}
          <div className="flex-1" />
          {/* CTA Arrow (for visual cue) */}
          <div className="flex justify-end mt-4">
            <CTAArrow />
          </div>
        </div>
        {/* Optional Image on the right */}
        {image && <CardImage src={image} alt={title + ' image'} />}
      </motion.div>
    </Link>
  );
};

export default ContentPostCard;
