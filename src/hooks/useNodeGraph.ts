// hooks/useNodeGraph.ts
import { useEffect, RefObject } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function useNodeGraph(
  canvasRef: RefObject<HTMLCanvasElement>,
  { fadeOpacity = 0.05, nodeRadius = 3, nodeCount = 100, maxDist = 150 } = {},
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let centerX = 0,
      centerY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    // Start mouse at center
    const mouse = { x: centerX, y: centerY };

    // Listen on window instead of canvas
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = centerX;
      mouse.y = centerY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      // fade to transparent
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // draw only nodes near mouse
      const active = nodes.filter(n => {
        const dx = n.x - mouse.x!;
        const dy = n.y - mouse.y!;
        return Math.hypot(dx, dy) < maxDist;
      });

      // draw nodes
      ctx.fillStyle = 'rgba(255,255,255,1)';
      for (const n of active) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // draw links
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const dx = active[i].x - active[j].x;
          const dy = active[i].y - active[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(active[i].x, active[i].y);
            ctx.lineTo(active[j].x, active[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, fadeOpacity, nodeRadius, nodeCount, maxDist]);
}
