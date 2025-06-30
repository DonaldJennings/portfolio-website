// components/atoms/TypingText.tsx
import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
}

export default function TypingText({ text, speed = 75, className = '' }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, ++idx));
      if (idx === text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '1ch',
          backgroundColor: 'currentColor',
          marginLeft: '2px',
          animation: 'blink 1s step-end infinite',
        }}
      />
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
