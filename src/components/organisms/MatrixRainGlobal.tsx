'use client';

import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('./MatrixRain'), {
  ssr: false,
  loading: () => null,
});

export default function MatrixRainGlobal() {
  return (
    <div className="absolute inset-0 z-5 pointer-events-none">
      <MatrixRain />
    </div>
  );
}
