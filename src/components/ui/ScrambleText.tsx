"use client";

import { cn } from "@/utils/cn";
import { useEffect, useMemo, useRef, useState } from "react";

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 100;

const SCOUTER_SYMBOLS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "dot",
  "hyphen",
];

interface ScrambleTextProps {
  text: string;
  className?: string;
  onScrambleEnd?: () => void;
  animate?: boolean;
  duration?: number;
}

export function ScrambleText({
  text,
  className,
  onScrambleEnd,
  animate = true,
  duration,
}: ScrambleTextProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeShuffleTime = useMemo(() => {
    if (!duration) return SHUFFLE_TIME;
    return duration / (text.length * CYCLES_PER_LETTER);
  }, [duration, text.length]);

  const totalAnimationTime = useMemo(() => {
    return duration ?? text.length * CYCLES_PER_LETTER * SHUFFLE_TIME;
  }, [duration, text.length]);

  const [pos, setPos] = useState(animate ? 0 : text.length * CYCLES_PER_LETTER);

  useEffect(() => {
    if (!animate) return;

    let currentPos = 0;
    setPos(0);

    const audio = new Audio("/sounds/scouter-scan-sound.mp3");
    audio.loop = false;

    const onMetadata = () => {
      const audioDurationMs = audio.duration * 1000;
      const rate = audioDurationMs / totalAnimationTime;
      audio.playbackRate = Math.max(0.1, Math.min(rate, 10));
    };

    audio.addEventListener("loadedmetadata", onMetadata);

    audio.play().catch(() => {
      /* Silently ignore autoplay errors */
    });

    intervalRef.current = setInterval(() => {
      currentPos++;
      setPos(currentPos);

      if (currentPos >= text.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onScrambleEnd?.();
        setTimeout(() => audio.pause(), 50);
      }
    }, activeShuffleTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [text, animate, onScrambleEnd, activeShuffleTime, totalAnimationTime]);

  const isFinished = pos / CYCLES_PER_LETTER >= text.length;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-px",
        !isFinished && animate && "text-radar-yellow",
        className,
      )}
    >
      {text.split("").map((char, index) => {
        if (pos / CYCLES_PER_LETTER > index || char === " ") {
          return <span key={index}>{char}</span>;
        }

        const randomSymbol =
          SCOUTER_SYMBOLS[Math.floor(Math.random() * SCOUTER_SYMBOLS.length)];

        return (
          <div
            key={index}
            style={{
              maskImage: `url(/assets/scouter-alphabet/${randomSymbol}.svg)`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
              WebkitMaskImage: `url(/assets/scouter-alphabet/${randomSymbol}.svg)`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
            }}
            className="h-[0.8em] aspect-square bg-current brightness-125"
          />
        );
      })}
    </span>
  );
}
