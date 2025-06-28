// app/page.tsx
import NodeGraph from '@/components/NodeGraph';

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background font-mono">
      {/* Animated node‐graph background */}
      <NodeGraph />

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Your hero content */}
      <div className="relative z-10 px-6 text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-primary drop-shadow-lg">Donald Jennings</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          IEng MIET | BSc (Hons) Computer Science at University of Edinburgh
          <br />
          Software Engineer at Leonardo UK Ltd
        </p>
      </div>
    </main>
  );
}
