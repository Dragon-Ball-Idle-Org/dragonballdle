"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  initialSeconds: number;
  className?: string;
}

export function Countdown({ initialSeconds, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const hours = Math.floor(initialSeconds / 3600);
    const minutes = Math.floor((initialSeconds % 3600) / 60);
    const seconds = initialSeconds % 60;
    return { hours, minutes, seconds };
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const clientStartTimeRef = useRef<number>(0);
  const serverInitialSecondsRef = useRef<number>(initialSeconds);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const elapsed = Math.floor(
      (Date.now() - clientStartTimeRef.current) / 1000,
    );
    const remainingSeconds = Math.max(
      0,
      serverInitialSecondsRef.current - elapsed,
    );
    return {
      hours: Math.floor(remainingSeconds / 3600),
      minutes: Math.floor((remainingSeconds % 3600) / 60),
      seconds: remainingSeconds % 60,
    };
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 1000) {
      setTimeLeft(calculateTimeLeft());
      lastUpdateRef.current = now;
    }
  }, [calculateTimeLeft]);

  useEffect(() => {
    clientStartTimeRef.current = Date.now();
    lastUpdateRef.current = clientStartTimeRef.current;

    const animate = () => {
      tick();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tick]);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <span className={className}>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </span>
  );
}
