import React from 'react';
import Tag from '../atoms/Tag';

interface TagListProps {
  tags: string[];
  hoveredTag: string | null;
  setHoveredTag: (tag: string | null) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, hoveredTag, setHoveredTag }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {tags.map(tag => (
      <Tag
        key={tag}
        tag={tag}
        isHovered={hoveredTag === tag}
        onMouseEnter={() => setHoveredTag(tag)}
        onMouseLeave={() => setHoveredTag(null)}
      />
    ))}
  </div>
);

export default TagList;
