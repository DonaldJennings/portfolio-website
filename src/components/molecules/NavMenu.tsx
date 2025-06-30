// components/molecules/NavMenu.tsx
import React from 'react';
import NavLink from '@/components/atoms/NavLink';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/#projects' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

export default function NavMenu({ vertical }: { vertical?: boolean }) {
  return (
    <div className={vertical ? 'space-y-2' : 'flex space-x-4'}>
      {links.map(link => (
        <NavLink key={link.name} href={link.href}>
          {link.name}
        </NavLink>
      ))}
    </div>
  );
}
