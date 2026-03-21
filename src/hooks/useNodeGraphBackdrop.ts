import { useEffect, RefObject } from 'react';

interface BackdropNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface SignalEdge {
  fromIdx: number;
  toIdx: number;
  arrivedAt: number; // frame number when the signal reaches this edge
}

interface UseNodeGraphBackdropOptions {
  /** Target node count at 1920×1080. Scales with screen area automatically. */
  nodeCount?: number;
  /** Connection distance at 1920×1080. Scales with sqrt(area). */
  maxDist?: number;
  mouseRadius?: number;
  accentRgb?: [number, number, number];
}

const BASE_W = 1920;
const BASE_H = 1080;
const BASE_AREA = BASE_W * BASE_H;
const HOP_FRAMES = 9;
const SIGNAL_FADE_FRAMES = 55;

function getScaledParams(
  w: number,
  h: number,
  baseCount: number,
  baseDist: number,
): { count: number; dist: number } {
  const area = w * h;
  const areaRatio = area / BASE_AREA;
  return {
    count: Math.max(45, Math.min(Math.round(baseCount * areaRatio), 500)),
    dist: Math.max(110, Math.min(Math.round(baseDist * Math.sqrt(areaRatio)), 320)),
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
    let frame = 0;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    const mouse = { x: cx, y: cy };

    const nodes: BackdropNode[] = [];
    let effectiveMaxDist = maxDist;

    const signalEdges: SignalEdge[] = [];

    const initNodes = (count: number) => {
      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1,
        });
      }
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

    const startSignal = (startIdx: number) => {
      signalEdges.length = 0;

      const visited = new Set<number>([startIdx]);
      const queue: { idx: number; depth: number }[] = [{ idx: startIdx, depth: 0 }];

      while (queue.length > 0) {
        const item = queue.shift()!;
        const node = nodes[item.idx];

        for (let j = 0; j < nodes.length; j++) {
          if (visited.has(j)) continue;
          if (Math.hypot(nodes[j].x - node.x, nodes[j].y - node.y) < effectiveMaxDist) {
            visited.add(j);
            signalEdges.push({
              fromIdx: item.idx,
              toIdx: j,
              arrivedAt: frame + item.depth * HOP_FRAMES,
            });
            queue.push({ idx: j, depth: item.depth + 1 });
          }
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = cx;
      mouse.y = cy;
    };
    const onClick = (e: MouseEvent) => {
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const d = Math.hypot(nodes[i].x - e.clientX, nodes[i].y - e.clientY);
        if (d < closestDist) {
          closestDist = d;
          closest = i;
        }
      }
      startSignal(closest);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Update node positions ---
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // --- Build active signal edge lookup (index pair → alpha) ---
      const signalMap = new Map<string, number>();
      for (const se of signalEdges) {
        if (frame < se.arrivedAt) continue;
        const age = frame - se.arrivedAt;
        if (age > SIGNAL_FADE_FRAMES) continue;
        const alpha = 1 - age / SIGNAL_FADE_FRAMES;
        const key = se.fromIdx < se.toIdx ? `${se.fromIdx}-${se.toIdx}` : `${se.toIdx}-${se.fromIdx}`;
        const existing = signalMap.get(key) ?? 0;
        if (alpha > existing) signalMap.set(key, alpha);
      }

      // --- Draw background edges ---
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist >= effectiveMaxDist) continue;

          const baseAlpha = (1 - dist / effectiveMaxDist) * 0.13;
          const key = `${i}-${j}`;
          const signalAlpha = signalMap.get(key);

          if (signalAlpha !== undefined) {
            // Faint signal highlight — just a slight brightness bump, no gradient flash
            ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha + signalAlpha * 0.18})`;
            ctx.lineWidth = 0.9;
          } else {
            ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha})`;
            ctx.lineWidth = 0.7;
          }

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // --- Draw signal particles (travelling dot along each edge) ---
      for (const se of signalEdges) {
        if (frame < se.arrivedAt) continue;
        const age = frame - se.arrivedAt;
        if (age > HOP_FRAMES) continue;
        const t = age / HOP_FRAMES;
        const pAlpha = (1 - t) * 0.3; // faint
        const from = nodes[se.fromIdx];
        const to = nodes[se.toIdx];
        const px = from.x + (to.x - from.x) * t;
        const py = from.y + (to.y - from.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pAlpha})`;
        ctx.fill();
      }

      // --- Mouse-to-node lines ---
      for (const n of nodes) {
        const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
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

      // --- Draw nodes ---
      for (const n of nodes) {
        const mouseDist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const proximity = mouseDist < mouseRadius ? 1 - mouseDist / mouseRadius : 0;
        const radius = n.radius + proximity * 2.5;
        const alpha = 0.22 + proximity * 0.65;
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
      window.removeEventListener('click', onClick);
    };
  }, [nodeCount, maxDist, mouseRadius, r, g, b]);
}
