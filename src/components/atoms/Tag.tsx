import React from 'react';

interface TagProps {
  tag: string;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Tag: React.FC<TagProps> = ({ tag, isHovered, onMouseEnter, onMouseLeave }) => {
  let borderColor = 'rgba(100,116,139,0.5)';
  const textColor = 'rgba(148,163,184,0.8)';
  let glow = '';
  if (tag.toLowerCase().includes('serverless')) {
    borderColor = 'rgba(34,197,94,0.7)';
    glow = '0 0 8px 2px rgba(34,197,94,0.25)';
  } else if (tag.toLowerCase().includes('architecture')) {
    borderColor = 'rgba(59,130,246,0.7)';
    glow = '0 0 8px 2px rgba(59,130,246,0.18)';
  }
  const defaultBoxShadow = glow || '0 0 8px 2px rgba(148,163,184,0.18)';
  return (
    <span
      className="rounded-full px-2 py-0.5 bg-transparent transition-all"
      style={{
        fontSize: '0.75rem',
        border: `1px solid ${borderColor}`,
        color: textColor,
        boxShadow: isHovered ? defaultBoxShadow : glow,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {tag}
    </span>
  );
};

export default Tag;
