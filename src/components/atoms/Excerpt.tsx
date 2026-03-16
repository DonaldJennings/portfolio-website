import React from 'react';

interface ExcerptProps {
  text: string;
  isTruncated: boolean;
  showFull: boolean;
  onShowMore: () => void;
}

const Excerpt: React.FC<ExcerptProps> = ({ text, isTruncated, showFull, onShowMore }) => (
  <p
    className={showFull ? 'mt-1' : 'mt-1 line-clamp-2'}
    style={{
      color: 'rgba(236,240,245,0.96)',
      lineHeight: '1.5',
      fontSize: '0.85rem',
      maxWidth: '100%',
    }}
  >
    {text}
    {isTruncated && !showFull && (
      <span
        className="ml-2 text-teal-400 hover:underline cursor-pointer text-xs font-semibold"
        onClick={e => {
          e.preventDefault();
          onShowMore();
        }}
      >
        Show more
      </span>
    )}
  </p>
);

export default Excerpt;
