// components/organisms/NodeGraph.tsx
'use client';

import { useRef } from 'react';
import CanvasElement from '@/components/atoms/CanvasElement';
import { useNodeGraph } from '@/hooks/useNodeGraph';

interface NodeGraphProps {
  nodeCount?: number;
  fadeOpacity?: number;
  maxDist?: number;
  nodeRadius?: number;
}

export default function NodeGraph({
  nodeCount = 250,
  fadeOpacity = 0.1,
  maxDist = 150,
  nodeRadius = 3,
}: NodeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;

  // Pass all four props through to the hook
  useNodeGraph(canvasRef, {
    nodeCount,
    fadeOpacity,
    maxDist,
    nodeRadius,
  });

  return (
    <CanvasElement
      canvasRef={canvasRef}
      className="absolute inset-0 z-0 opacity-50 pointer-events-none"
    />
  );
}
