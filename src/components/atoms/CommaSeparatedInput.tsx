'use client';
import { useEffect, useState } from 'react';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function CommaSeparatedInput({ value, onChange, placeholder, className }: Props) {
  const [raw, setRaw] = useState(() => value.join(', '));

  // Sync when the parent swaps to a different item (e.g. switching selected project)
  useEffect(() => {
    setRaw(value.join(', '));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.join(',')]);

  function handleBlur() {
    const parsed = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onChange(parsed);
    setRaw(parsed.join(', '));
  }

  return (
    <input
      type="text"
      className={className}
      value={raw}
      onChange={e => setRaw(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}
