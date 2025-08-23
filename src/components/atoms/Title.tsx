import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3 line-clamp-2 leading-tight">
    {children}
  </h2>
);

export default Title;
