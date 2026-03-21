import { useEffect, RefObject } from 'react';

interface BackdropNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface UseNodeGraphBackdropOptions {
  /** Target node count at 1920×1080. Scales with screen area automatically. */
  nodeCount?: number;
  /** Connection distance at 1920×1080. Scales with sqrt(area). */
  maxDist?: number;
  mouseRadius?: number;
  accentRgb?: [number, number, number];
}

// Base resolution: target counts are calibrated for this area
const BASE_W = 1920;
const BASE_H = 1080;
const BASE_AREA = BASE_W * BASE_H;

function getScaledParams(
  w: number,
  h: number,
  baseCount: number,
  baseDist: number,
): { count: number; dist: number } {
  const area = w * h;
  const areaRatio = area / BASE_AREA;
  const count = Math.round(baseCount * areaRatio);
  const dist = Math.round(baseDist * Math.sqrt(areaRatio));
  return {
    count: Math.max(45, Math.min(count, 500)),
    dist: Math.max(110, Math.min(dist, 320)),
  };
}

export function useNodeGraphBackdrop(
  canvasRef: RefObject<HTMLCanvasElement>,
  {
    nodeCount = 90,
    maxDist = 170,
    mouseRadius = 240,
    accentRgb = [74, 222, 128],
  }: UseNodeGraphBackdropOptions = {},
) {
  const [r, g, b] = accentRgb;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    const mouse = { x: cx, y: cy };

    const nodes: BackdropNode[] = [];
    let effectiveMaxDist = maxDist;

    const initNodes = (count: number) => {
      while (nodes.length < count) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1,
        });
      }
      if (nodes.length > count) nodes.splice(count);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height / 2;

      const { count, dist } = getScaledParams(canvas.width, canvas.height, nodeCount, maxDist);
      effectiveMaxDist = dist;
      initNodes(count);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = cx;
      mouse.y = cy;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Background edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < effectiveMaxDist) {
            const alpha = (1 - dist / effectiveMaxDist) * 0.13;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Cursor-to-node edges
      for (const n of nodes) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseRadius) {
          const proximity = 1 - dist / mouseRadius;
          ctx.strokeStyle = `rgba(${r},${g},${b},${proximity * 0.5})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const proximity = dist < mouseRadius ? 1 - dist / mouseRadius : 0;
        const alpha = 0.22 + proximity * 0.65;
        const radius = n.radius + proximity * 2.5;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [nodeCount, maxDist, mouseRadius, r, g, b]);
}
