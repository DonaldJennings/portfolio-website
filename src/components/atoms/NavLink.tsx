// components/atoms/NavLink.tsx
import React from 'react';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
  target?: string;
  rel?: string;
}

export default function NavLink({ href, children, className, target, rel }: NavLinkProps) {
  return (
    <a href={href} className={className} target={target} rel={rel}>
      {children}
    </a>
  );
}
