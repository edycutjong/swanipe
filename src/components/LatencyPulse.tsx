"use client";

import { useEffect, useRef } from "react";

export function LatencyPulse({ size = 200 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 10;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // Concentric rings
      for (let i = 1; i <= 4; i++) {
        const r = (maxR / 4) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.08 + i * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cross hairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Sweep line
      angleRef.current += 0.015;
      const sweepAngle = angleRef.current;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(sweepAngle) * maxR,
        cy + Math.sin(sweepAngle) * maxR
      );
      ctx.strokeStyle = "rgba(34, 197, 94, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweep trail (gradient arc)
      const trailAngle = 0.8;
      const gradient = ctx.createConicGradient(sweepAngle - trailAngle, cx, cy);
      gradient.addColorStop(0, "rgba(34, 197, 94, 0)");
      gradient.addColorStop(trailAngle / (2 * Math.PI), "rgba(34, 197, 94, 0.15)");
      gradient.addColorStop(trailAngle / (2 * Math.PI) + 0.001, "rgba(34, 197, 94, 0)");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - trailAngle, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Blips (simulated targets)
      const blips = [
        { angle: 1.2, dist: 0.6, label: "RPC Fast" },
        { angle: 3.8, dist: 0.85, label: "Public" },
        { angle: 5.5, dist: 0.4, label: "WSS" },
      ];
      for (const blip of blips) {
        const bx = cx + Math.cos(blip.angle) * maxR * blip.dist;
        const by = cy + Math.sin(blip.angle) * maxR * blip.dist;
        const angleDiff = ((sweepAngle - blip.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const brightness = angleDiff < 1 ? 1 - angleDiff : 0.3;

        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${brightness})`;
        ctx.fill();
        if (brightness > 0.5) {
          ctx.beginPath();
          ctx.arc(bx, by, 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${brightness * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="opacity-60"
    />
  );
}
