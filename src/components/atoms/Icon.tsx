import React from 'react';

type IconProps = {
  name: 'calendar' | 'tag' | 'user';
  size?: number;
  className?: string;
};

export default function Icon({ name, size = 20, className = '' }: IconProps) {
  switch (name) {
    case 'calendar':
      return (
        <svg
          width={size}
          height={size}
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="2" />
          <path d="M16 2v4M8 2v4" strokeWidth="2" />
        </svg>
      );
    case 'tag':
      return (
        <svg
          width={size}
          height={size}
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M2 12l10 10 10-10-10-10-10 10z" strokeWidth="2" />
        </svg>
      );
    case 'user':
      return (
        <svg
          width={size}
          height={size}
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M6 20v-2a6 6 0 0112 0v2" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}
