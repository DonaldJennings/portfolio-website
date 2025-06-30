// components/atoms/Logo.tsx
import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold text-white">
      Donald<span className="text-blue-500">J</span>
    </Link>
  );
}
