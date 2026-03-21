// components/atoms/TypingText.tsx
import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
}

export default function TypingText({ text, speed = 60, className = '' }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, ++idx));
      if (idx === text.length) {
        clearInterval(iv);
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {displayed}
      {showCursor && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 translate-y-[0.1em]"
          style={{
            background: 'var(--accent-1)',
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </span>
  );
}
