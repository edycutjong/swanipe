"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = null;

    function step(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    }

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
