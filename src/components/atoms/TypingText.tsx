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
          className="inline-block w-0.5 h-6 bg-blue-400 ml-1"
          style={{
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </span>
  );
}
