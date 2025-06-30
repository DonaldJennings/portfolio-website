// components/organisms/MatrixRain.tsx
'use client';

import { useRef } from 'react';
import { useMatrixRain } from '@/hooks/useMatrixRain';
import CanvasElement from '@/components/atoms/CanvasElement';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  useMatrixRain(canvasRef);

  return (
    <CanvasElement
      canvasRef={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
    />
  );
}
