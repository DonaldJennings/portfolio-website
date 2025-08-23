export default function MatrixRainRender() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full"
          style={{
            opacity: 0.6,
            position: 'absolute',
            inset: 0,
          }}
        >
          {/* MatrixRainGlobal renders the animated effect */}
          <div id="matrix-rain-global" />
        </div>
      </div>
    </div>
  );
}
