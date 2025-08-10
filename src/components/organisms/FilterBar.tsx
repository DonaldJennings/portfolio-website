import React from 'react';
import Button from '@/components/atoms/Button';

type FilterBarProps = {
  tags: string[];
  selectedTag?: string;
  onTagSelect: (tag: string | undefined) => void;
};

export default function FilterBar({ tags, selectedTag, onTagSelect }: FilterBarProps) {
  return (
    <div className="flex gap-2 mb-8 flex-wrap">
      <Button
        variant={selectedTag ? 'secondary' : 'primary'}
        onClick={() => onTagSelect(undefined)}
      >
        All
      </Button>
      {tags.map(tag => (
        <Button
          key={tag}
          variant={selectedTag === tag ? 'primary' : 'secondary'}
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
