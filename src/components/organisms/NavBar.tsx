'use client';

import React from 'react';
import Logo from '@/components/atoms/Logo';
import NavMenu from '@/components/molecules/NavMenu';
import MobileMenuToggle from '@/components/molecules/MobileMenuToggle';

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md shadow-md transition-all">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Desktop menu */}
          <div className="hidden md:flex">
            <NavMenu />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden ml-4">
            <MobileMenuToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
