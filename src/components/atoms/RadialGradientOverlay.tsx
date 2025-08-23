export default function RadialGradientOverlay() {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(59,130,246,0.18) 0%, rgba(15,23,42,0.85) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
