import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h2 className="text-base md:text-lg font-bold mt-1 mb-1 line-clamp-2 leading-tight">
    {children}
  </h2>
);

export default Title;
