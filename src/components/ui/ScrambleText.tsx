"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

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
}

export function ScrambleText({
  text,
  className,
  onScrambleEnd,
}: ScrambleTextProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let currentPos = 0;
    setPos(0);

    intervalRef.current = setInterval(() => {
      currentPos++;
      setPos(currentPos);

      if (currentPos >= text.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onScrambleEnd?.();
      }
    }, SHUFFLE_TIME);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-px text-radar-yellow",
        className,
      )}
    >
      {text.split("").map((char, index) => {
        if (pos / CYCLES_PER_LETTER > index || char === " ") {
          return (
            <span key={index} className="min-w-[0.5ch]">
              {char}
            </span>
          );
        }

        const randomSymbol =
          SCOUTER_SYMBOLS[Math.floor(Math.random() * SCOUTER_SYMBOLS.length)];

        return (
          <img
            key={index}
            src={`/assets/scouter-alphabet/${randomSymbol}.svg`}
            alt="scouter symbol"
            className="h-[0.85em] w-auto inline-block brightness-110 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]"
          />
        );
      })}
    </span>
  );
}
