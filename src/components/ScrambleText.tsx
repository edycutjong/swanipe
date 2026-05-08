"use client";

import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export function ScrambleText({ text, className = "", speed = 30, delay = 0 }: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let revealIndex = 0;
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        revealIndex++;
        const revealed = text.slice(0, revealIndex);
        const scrambled = text
          .slice(revealIndex)
          .split("")
          .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("");
        setDisplayed(revealed + scrambled);

        if (revealIndex >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayed(text);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayed || text.replace(/./g, " ")}</span>;
}
