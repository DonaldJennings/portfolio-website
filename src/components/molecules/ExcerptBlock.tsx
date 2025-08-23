import React from 'react';
import Excerpt from '../atoms/Excerpt';

interface ExcerptBlockProps {
  excerptText: string;
  isTruncated: boolean;
  showFullExcerpt: boolean;
  onShowMore: () => void;
}

const ExcerptBlock: React.FC<ExcerptBlockProps> = ({
  excerptText,
  isTruncated,
  showFullExcerpt,
  onShowMore,
}) => (
  <Excerpt
    text={excerptText}
    isTruncated={isTruncated}
    showFull={showFullExcerpt}
    onShowMore={onShowMore}
  />
);

export default ExcerptBlock;
