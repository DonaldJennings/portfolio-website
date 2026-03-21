'use client';

import { useEffect, useRef } from 'react';

const NUM_STARS = 280;
const SPEED = 0.25;
const MAX_DEPTH = 1000;
const ROCKET_INTERVAL_MIN = 18000; // ms between rockets
const ROCKET_INTERVAL_MAX = 40000;

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  hue: number;
  sizeMult: number; // size variety: mostly small, occasionally large
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

function spawnStar(w: number, h: number, scatter = true): Star {
  const z = scatter ? Math.random() * MAX_DEPTH + 1 : MAX_DEPTH;
  const hue = Math.random() < 0.15 ? 210 + Math.random() * 30 : 0; // mostly white, some blue-white
  const cx = w / 2;
  const cy = h / 2;
  const screenX = (Math.random() - 0.5) * w * 1.2;
  const screenY = (Math.random() - 0.5) * h * 1.2;
  // Power distribution: mostly small stars (0.4–1.2), occasionally larger (up to ~3.5)
  const sizeMult = Math.pow(Math.random(), 2.2) * 3.2 + 0.4;
  return {
    x: screenX * z,
    y: screenY * z,
    z,
    prevX: screenX + cx,
    prevY: screenY + cy,
    hue,
    sizeMult,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.4 + Math.random() * 1.8,
  };
}

function spawnRocket(w: number, h: number): Rocket {
  const edge = Math.floor(Math.random() * 4);
  const speed = 2.2 + Math.random() * 1.4;
  const drift = (Math.random() - 0.5) * 0.5; // slight angle off-axis
  let x: number, y: number, vx: number, vy: number;

  switch (edge) {
    case 0: // from left
      x = -70; y = h * (0.2 + Math.random() * 0.6);
      vx = speed; vy = drift * speed;
      break;
    case 1: // from right
      x = w + 70; y = h * (0.2 + Math.random() * 0.6);
      vx = -speed; vy = drift * speed;
      break;
    case 2: // from top
      x = w * (0.2 + Math.random() * 0.6); y = -70;
      vx = drift * speed; vy = speed;
      break;
    default: // from bottom
      x = w * (0.2 + Math.random() * 0.6); y = h + 70;
      vx = drift * speed; vy = -speed;
  }

  return { x, y, vx, vy, angle: Math.atan2(vy, vx) };
}

function drawRocket(ctx: CanvasRenderingContext2D, rocket: Rocket, frame: number) {
  const { x, y, angle } = rocket;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const t = frame * 0.06;

  // --- Exhaust flame ---
  const flicker = Math.sin(t * 3.1) * 3 + Math.sin(t * 5.7) * 2;
  const flameLen = 22 + flicker;

  // Outer flame bloom
  const outerGrad = ctx.createLinearGradient(-14 - flameLen * 1.1, 0, -10, 0);
  outerGrad.addColorStop(0, 'rgba(255,80,10,0)');
  outerGrad.addColorStop(0.5, 'rgba(255,130,30,0.25)');
  outerGrad.addColorStop(1, 'rgba(255,200,80,0.35)');
  ctx.beginPath();
  ctx.moveTo(-10, 6);
  ctx.lineTo(-14 - flameLen * 1.1, Math.sin(t * 2.3) * 3);
  ctx.lineTo(-10, -6);
  ctx.fillStyle = outerGrad;
  ctx.fill();

  // Inner flame core
  const innerGrad = ctx.createLinearGradient(-14 - flameLen, 0, -10, 0);
  innerGrad.addColorStop(0, 'rgba(255,200,50,0)');
  innerGrad.addColorStop(0.35, 'rgba(255,170,40,0.8)');
  innerGrad.addColorStop(1, 'rgba(255,255,180,1)');
  ctx.beginPath();
  ctx.moveTo(-10, 3.5);
  ctx.lineTo(-14 - flameLen, Math.sin(t * 4.1) * 1.5);
  ctx.lineTo(-10, -3.5);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // --- Body ---
  ctx.beginPath();
  // Manually rounded rect for broad compatibility
  const bx = -14, by = -5.5, bw = 26, bh = 11, br = 3;
  ctx.moveTo(bx + br, by);
  ctx.lineTo(bx + bw - br, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
  ctx.lineTo(bx + bw, by + bh - br);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
  ctx.lineTo(bx + br, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
  ctx.lineTo(bx, by + br);
  ctx.quadraticCurveTo(bx, by, bx + br, by);
  ctx.closePath();
  ctx.fillStyle = 'rgba(215,228,255,0.95)';
  ctx.fill();

  // Body highlight stripe
  ctx.beginPath();
  ctx.rect(-8, -5.5, 14, 2.5);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fill();

  // --- Nose cone ---
  ctx.beginPath();
  ctx.moveTo(12, -5.5);
  ctx.lineTo(25, 0);
  ctx.lineTo(12, 5.5);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,90,70,0.97)';
  ctx.fill();

  // --- Fins ---
  // Top fin
  ctx.beginPath();
  ctx.moveTo(-8, -5.5);
  ctx.lineTo(-14, -13);
  ctx.lineTo(-2, -5.5);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,75,55,0.9)';
  ctx.fill();

  // Bottom fin
  ctx.beginPath();
  ctx.moveTo(-8, 5.5);
  ctx.lineTo(-14, 13);
  ctx.lineTo(-2, 5.5);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,75,55,0.9)';
  ctx.fill();

  // --- Porthole ---
  ctx.beginPath();
  ctx.arc(3, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(100,195,255,0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(180,225,255,0.7)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Porthole inner gleam
  ctx.beginPath();
  ctx.arc(1.5, -1.2, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fill();

  ctx.restore();
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
    let rocket: Rocket | null = null;
    let rocketTimerId: ReturnType<typeof setTimeout> | null = null;
    let w = 0, h = 0;
    let frame = 0;

    function scheduleRocket() {
      const delay = ROCKET_INTERVAL_MIN + Math.random() * (ROCKET_INTERVAL_MAX - ROCKET_INTERVAL_MIN);
      rocketTimerId = setTimeout(() => {
        rocket = spawnRocket(w, h);
      }, delay);
    }

    function init() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      stars = Array.from({ length: NUM_STARS }, () => spawnStar(w, h, true));
    }

    function resetStar(s: Star) {
      const ns = spawnStar(w, h, false);
      s.x = ns.x; s.y = ns.y; s.z = ns.z;
      s.prevX = ns.prevX; s.prevY = ns.prevY;
      s.hue = ns.hue; s.sizeMult = ns.sizeMult;
      s.twinklePhase = ns.twinklePhase; s.twinkleSpeed = ns.twinkleSpeed;
    }

    function draw() {
      frame++;
      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      for (const s of stars) {
        s.z -= SPEED;

        if (s.z <= 1) { resetStar(s); continue; }

        const sx = s.x / s.z + cx;
        const sy = s.y / s.z + cy;

        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) {
          resetStar(s); continue;
        }

        const t = 1 - s.z / MAX_DEPTH; // 0=far, 1=close
        const twinkle = 0.82 + 0.18 * Math.sin(frame * s.twinkleSpeed * 0.055 + s.twinklePhase);
        const opacity = Math.min(1, t * 1.2) * 0.9 * twinkle;
        const radius = Math.max(0.3, t * 2.0 * s.sizeMult);

        // Streak for close stars
        if (t > 0.55 && (Math.abs(sx - s.prevX) > 0.3 || Math.abs(sy - s.prevY) > 0.3)) {
          ctx!.beginPath();
          ctx!.moveTo(s.prevX, s.prevY);
          ctx!.lineTo(sx, sy);
          ctx!.strokeStyle = s.hue > 0
            ? `hsla(${s.hue},80%,90%,${opacity * 0.35})`
            : `rgba(255,255,255,${opacity * 0.3})`;
          ctx!.lineWidth = radius * 0.6;
          ctx!.stroke();
        }

        // Soft radial glow for mid-to-large stars
        if (radius > 0.9) {
          const glowR = radius * (3 + twinkle * 1.5);
          const glowAlpha = opacity * Math.min(0.55, s.sizeMult * 0.18);
          const gGrad = ctx!.createRadialGradient(sx, sy, 0, sx, sy, glowR);
          const col = s.hue > 0 ? `hsla(${s.hue},80%,90%,` : 'rgba(255,255,255,';
          gGrad.addColorStop(0, `${col}${glowAlpha})`);
          gGrad.addColorStop(1, `${col}0)`);
          ctx!.beginPath();
          ctx!.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx!.fillStyle = gGrad;
          ctx!.fill();
        }

        // 4-point sparkle cross for large bright stars
        if (s.sizeMult > 2.0 && t > 0.35) {
          const spikeLen = radius * 4.5 * twinkle;
          const spikeAlpha = opacity * 0.55 * Math.min(1, (t - 0.35) / 0.4);
          const spikeCol = s.hue > 0
            ? `hsla(${s.hue},80%,95%,${spikeAlpha})`
            : `rgba(255,255,255,${spikeAlpha})`;
          // Slowly rotating sparkle
          const rot = frame * 0.008 + s.twinklePhase;
          ctx!.save();
          ctx!.translate(sx, sy);
          ctx!.rotate(rot);
          ctx!.strokeStyle = spikeCol;
          ctx!.lineWidth = 0.6;
          for (let i = 0; i < 2; i++) {
            ctx!.beginPath();
            ctx!.moveTo(-spikeLen, 0);
            ctx!.lineTo(spikeLen, 0);
            ctx!.stroke();
            ctx!.rotate(Math.PI / 2);
          }
          ctx!.restore();
        }

        // Star dot
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx!.fillStyle = s.hue > 0
          ? `hsla(${s.hue},60%,95%,${opacity})`
          : `rgba(255,255,255,${opacity})`;
        ctx!.fill();

        s.prevX = sx;
        s.prevY = sy;
      }

      // Rocket easter egg
      if (rocket) {
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        drawRocket(ctx!, rocket, frame);

        if (rocket.x < -130 || rocket.x > w + 130 || rocket.y < -130 || rocket.y > h + 130) {
          rocket = null;
          scheduleRocket();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    scheduleRocket();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      if (rocketTimerId !== null) clearTimeout(rocketTimerId);
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
