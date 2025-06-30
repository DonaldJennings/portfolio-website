// components/atoms/IconButton.tsx
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function IconButton({ onClick, children, className = '' }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
