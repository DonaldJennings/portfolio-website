'use client';

import React from 'react';
import Logo from '@/components/atoms/Logo';
import NavMenu from '@/components/molecules/NavMenu';
import MobileMenuToggle from '@/components/molecules/MobileMenuToggle';
import ThemeToggle from '@/components/atoms/ThemeToggle';

export default function NavBar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 shadow-md transition-all"
      style={{
        background: 'linear-gradient(90deg, rgba(30,41,59,0.82) 0%, rgba(15,23,42,0.82) 100%)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 4px 24px 0 rgba(59,130,246,0.10)',
        borderBottom: '1px solid rgba(59,130,246,0.10)',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Desktop menu and theme toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <NavMenu />
            <ThemeToggle />
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <MobileMenuToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
