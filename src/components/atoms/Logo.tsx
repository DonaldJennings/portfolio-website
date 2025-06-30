// components/atoms/Logo.tsx
import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" legacyBehavior>
      <a className="text-2xl font-bold text-white">
        Donald<span className="text-green-400">J</span>
      </a>
    </Link>
  );
}
