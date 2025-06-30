// components/organisms/NodeGraph.tsx
'use client';
import { useRef } from 'react';
import CanvasElement from '@/components/atoms/CanvasElement';
import { useNodeGraph } from '@/hooks/useNodeGraph';

export default function NodeGraph({ nodeCount = 100 }: { nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useNodeGraph(canvasRef, { nodeCount });

  return (
    <CanvasElement
      canvasRef={canvasRef}
      className="absolute inset-0 z-0 opacity-50 pointer-events-none"
    />
  );
}
