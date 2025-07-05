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
        <div
          className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 shadow-xl"
          onClick={() => setOpen(false)}
        >
          <NavMenu vertical />
        </div>
      )}
    </div>
  );
}
