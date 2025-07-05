// components/atoms/NavLink.tsx
import React from 'react';
import Link from 'next/link';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  isActive?: boolean;
}

export default function NavLink({
  href,
  children,
  className = '',
  target,
  rel,
  isActive = false,
}: NavLinkProps) {
  const baseClass = 'transition-colors px-2 py-1 font-medium';
  const activeClass = 'text-white font-semibold';
  const inactiveClass = 'text-slate-300 hover:text-blue-400 hover:underline underline-offset-4';

  const finalClass = `${baseClass} ${isActive ? activeClass : inactiveClass} ${className}`.trim();

  // Handle smooth scrolling for hash links
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');

      // If we're on the same page or going to root, handle smooth scroll
      if (path === '' || path === '/' || window.location.pathname === path) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }
  };

  // For external links or targets, use regular anchor
  if (target === '_blank' || href.startsWith('http')) {
    return (
      <a href={href} className={finalClass} target={target} rel={rel} onClick={handleClick}>
        {children}
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link href={href} className={finalClass} onClick={handleClick}>
      {children}
    </Link>
  );
}
