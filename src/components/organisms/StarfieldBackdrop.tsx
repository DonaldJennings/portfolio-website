'use client';

import { useEffect, useRef } from 'react';

const NUM_STARS = 280;
const SPEED = 0.25; // slow drift
const MAX_DEPTH = 1000;

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  hue: number; // slight color variation per star
}

function spawnStar(w: number, h: number, scatter = true): Star {
  const z = scatter ? Math.random() * MAX_DEPTH + 1 : MAX_DEPTH;
  const hue = Math.random() < 0.15 ? 210 + Math.random() * 30 : 0; // most white, some blue-white
  return {
    x: (Math.random() - 0.5) * w * 2.4,
    y: (Math.random() - 0.5) * h * 2.4,
    z,
    prevX: 0,
    prevY: 0,
    hue,
  };
}

export default function StarfieldBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];
    let w = 0,
      h = 0;

    function init() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      stars = Array.from({ length: NUM_STARS }, () => spawnStar(w, h, true));
      const cx = w / 2,
        cy = h / 2;
      for (const s of stars) {
        s.prevX = s.x / s.z + cx;
        s.prevY = s.y / s.z + cy;
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;

      for (const s of stars) {
        s.z -= SPEED;

        if (s.z <= 1) {
          const ns = spawnStar(w, h, false);
          s.x = ns.x;
          s.y = ns.y;
          s.z = MAX_DEPTH;
          s.prevX = s.x / s.z + cx;
          s.prevY = s.y / s.z + cy;
          continue;
        }

        const sx = s.x / s.z + cx;
        const sy = s.y / s.z + cy;

        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) {
          const ns = spawnStar(w, h, false);
          s.x = ns.x;
          s.y = ns.y;
          s.z = MAX_DEPTH;
          s.prevX = s.x / s.z + cx;
          s.prevY = s.y / s.z + cy;
          continue;
        }

        const t = 1 - s.z / MAX_DEPTH; // 0 (far) → 1 (close)
        const opacity = Math.min(1, t * 1.2) * 0.9;
        const radius = Math.max(0.4, t * 2.2);

        // streak effect only for stars that are close enough
        if (t > 0.55 && (Math.abs(sx - s.prevX) > 0.3 || Math.abs(sy - s.prevY) > 0.3)) {
          ctx!.beginPath();
          ctx!.moveTo(s.prevX, s.prevY);
          ctx!.lineTo(sx, sy);
          const streakColor =
            s.hue > 0
              ? `hsla(${s.hue}, 80%, 90%, ${opacity * 0.35})`
              : `rgba(255,255,255,${opacity * 0.3})`;
          ctx!.strokeStyle = streakColor;
          ctx!.lineWidth = radius * 0.6;
          ctx!.stroke();
        }

        const starColor =
          s.hue > 0
            ? `hsla(${s.hue}, 60%, 95%, ${opacity})`
            : `rgba(255,255,255,${opacity})`;

        ctx!.beginPath();
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx!.fillStyle = starColor;
        ctx!.fill();

        s.prevX = sx;
        s.prevY = sy;
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.65 }}
    />
  );
}
