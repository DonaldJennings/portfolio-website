import React from 'react';

type HeroTitleProps = {
  children: React.ReactNode;
  className?: string;
};

function HeroTitle({ children, className = '' }: HeroTitleProps) {
  return (
    <h1
      className={`text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white ${className}`}
    >
      {children}
    </h1>
  );
}

export default HeroTitle;
