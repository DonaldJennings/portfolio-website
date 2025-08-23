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
  const baseClass = 'transition-colors px-2 py-1 font-medium relative group';
  const activeClass = 'text-white font-semibold';
  const inactiveClass = 'text-slate-300 hover:text-green-400';

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
        <span className="relative">
          {children}
          <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
        </span>
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link href={href} className={finalClass} onClick={handleClick}>
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
      </span>
    </Link>
  );
}
