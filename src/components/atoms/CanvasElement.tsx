// components/atoms/CanvasElement.tsx
import { RefObject } from 'react';

interface CanvasElementProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  className?: string;
}

export default function CanvasElement({ canvasRef, className }: CanvasElementProps) {
  return <canvas ref={canvasRef} className={className} />;
}
