'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@/components/context/ThemeContext';

const MatrixRain = dynamic(() => import('./MatrixRain'), { ssr: false, loading: () => null });
const NodeGraphBackdrop = dynamic(() => import('./NodeGraphBackdrop'), { ssr: false, loading: () => null });
const StarfieldBackdrop = dynamic(() => import('./StarfieldBackdrop'), { ssr: false, loading: () => null });

export default function ActiveBackdrop() {
  const { backdropId } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {backdropId === 'matrix-rain' && <MatrixRain />}
      {backdropId === 'node-graph' && <NodeGraphBackdrop />}
      {backdropId === 'starfield' && <StarfieldBackdrop />}
    </div>
  );
}
