// components/atoms/Logo.tsx
import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="text-white font-bold text-lg">
      Donald<span className="text-slate-400">J</span>
    </Link>
  );
}
