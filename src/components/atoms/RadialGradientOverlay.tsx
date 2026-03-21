export default function RadialGradientOverlay() {
  return (
    <div
      className="radial-overlay absolute inset-0 w-full h-full"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 20%, var(--radial-glow) 0%, rgba(var(--surface-base-rgb),0.85) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
