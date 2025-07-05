// components/molecules/NavMenu.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavLink from '@/components/atoms/NavLink';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Developer Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function NavMenu({ vertical }: { vertical?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={vertical ? 'space-y-2' : 'flex space-x-4'}>
      {links.map(link => {
        // Handle active state for about section when on home page
        const isActive = pathname === link.href || (link.href === '/#about' && pathname === '/');

        return (
          <NavLink
            key={link.name}
            href={link.href}
            className={`px-2 py-1 transition-colors`}
            isActive={isActive}
          >
            {link.name}
          </NavLink>
        );
      })}
    </div>
  );
}
