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
  onClick?: (e: React.MouseEvent) => void;
}

export default function NavLink({
  href,
  children,
  className = '',
  target,
  rel,
  isActive = false,
  onClick,
}: NavLinkProps) {
  const baseClass = 'transition-colors px-2 py-1 font-medium';
  const activeClass = 'text-white font-semibold';
  const inactiveClass = 'text-slate-300 hover:text-green-400 hover:underline underline-offset-4';

  const finalClass = `${baseClass} ${isActive ? activeClass : inactiveClass} ${className}`.trim();

  // Handle smooth scrolling for hash links and custom onClick
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick first if provided
    if (onClick) {
      onClick(e);
    }

    // Only handle hash navigation if the event wasn't prevented
    if (!e.defaultPrevented && href.includes('#')) {
      const [path, hash] = href.split('#');

      // If we're already on the home page, just scroll
      if (window.location.pathname === '/' || path === '/') {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80; // h-20 = 80px
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
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
