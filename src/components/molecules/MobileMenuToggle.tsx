// components/molecules/MobileMenuToggle.tsx
'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import IconButton from '@/components/atoms/IconButton';
import NavMenu from './NavMenu';

export default function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <IconButton onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </IconButton>

      {open && (
        <div className="absolute top-full inset-x-0 bg-gray-800 py-4 px-6 shadow-lg">
          <NavMenu vertical />
        </div>
      )}
    </div>
  );
}
