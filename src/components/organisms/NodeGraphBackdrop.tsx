'use client';

import { useRef } from 'react';
import CanvasElement from '@/components/atoms/CanvasElement';
import { useNodeGraphBackdrop } from '@/hooks/useNodeGraphBackdrop';
import { useTheme } from '@/components/context/ThemeContext';
import { getColorScheme } from '@/lib/themes';

export default function NodeGraphBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  const { colorScheme } = useTheme();
  const scheme = getColorScheme(colorScheme);

  useNodeGraphBackdrop(canvasRef, {
    nodeCount: 110,
    maxDist: 190,
    mouseRadius: 260,
    accentRgb: scheme.accentRgb,
  });

  return (
    <CanvasElement canvasRef={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-90" />
  );
}
