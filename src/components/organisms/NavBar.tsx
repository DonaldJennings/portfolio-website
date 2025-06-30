// components/organisms/NavBar.tsx
'use client';

import React from 'react';
import Logo from '@/components/atoms/Logo';
import NavMenu from '@/components/molecules/NavMenu';
import MobileMenuToggle from '@/components/molecules/MobileMenuToggle';

export default function NavBar() {
  return (
    <nav className="bg-black bg-opacity-60 backdrop-blur-sm fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop menu */}
          <div className="hidden md:flex">
            <NavMenu />
          </div>

          {/* Mobile toggle */}
          <MobileMenuToggle />
        </div>
      </div>
    </nav>
  );
}
