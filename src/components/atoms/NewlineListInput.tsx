'use client';
import { useEffect, useState } from 'react';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
};

export default function NewlineListInput({ value, onChange, placeholder, className, rows = 5 }: Props) {
  const [raw, setRaw] = useState(() => value.join('\n'));

  useEffect(() => {
    setRaw(value.join('\n'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.join('\n')]);

  function handleBlur() {
    const parsed = raw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    onChange(parsed);
    setRaw(parsed.join('\n'));
  }

  return (
    <textarea
      className={className}
      rows={rows}
      value={raw}
      onChange={e => setRaw(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}
