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
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30,58,138,0.45) 0%, rgba(23,37,84,0.45) 85%, rgba(15,23,42,0.3) 100%)',
        }}
      />
    </div>
  );
}
