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
      className={`p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
