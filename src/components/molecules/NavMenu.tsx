// components/molecules/NavMenu.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavLink from '@/components/atoms/NavLink';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/', scrollTo: 'about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Developer Blog', href: '/dev-blog' },
  { name: 'Contact', href: '/contact' },
];

export default function NavMenu({ vertical }: { vertical?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={vertical ? 'flex flex-col space-y-3' : 'flex space-x-4'}>
      {links.map(link => {
        // Handle active state for about section when on home page
        const isActive = pathname === link.href || (link.scrollTo === 'about' && pathname === '/');

        const handleLinkClick = (e: React.MouseEvent) => {
          if (link.scrollTo) {
            // If we're already on the home page, just scroll
            if (pathname === '/') {
              e.preventDefault();
              const element = document.getElementById(link.scrollTo);
              if (element) {
                const navbarHeight = 80; // h-20 = 80px
                const elementPosition = element.offsetTop - navbarHeight;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth',
                });
              }
            } else {
              // If we're on a different page, store the scroll target
              sessionStorage.setItem('scrollToSection', link.scrollTo);
            }
          }
        };

        return (
          <NavLink
            key={link.name}
            href={link.href}
            className={
              vertical
                ? 'block py-3 px-4 text-lg font-medium text-center border-b border-slate-800 last:border-b-0 hover:bg-slate-700/50 transition-all'
                : 'px-2 py-1 transition-colors'
            }
            isActive={isActive}
            onClick={handleLinkClick}
          >
            {link.name}
          </NavLink>
        );
      })}
    </div>
  );
}
