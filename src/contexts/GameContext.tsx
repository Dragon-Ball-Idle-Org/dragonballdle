"use client";

import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { msUntilMidnightUTC } from "@/utils/time";
import { createContext, useContext, ReactNode, useState } from "react";

const GAME_WON_KEY = "dragonballdle:game-won";

type GameContextValue = {
  winsCount?: number;
  updateWinsCount: (newCount: number) => void;
  isGameWon: boolean;
  wonGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [winsCount, setWinsCount] = useState<number | undefined>(undefined);
  const [isGameWon, setIsGameWon] = useState<boolean>(
    typeof window !== "undefined"
      ? (getWithExpiry(GAME_WON_KEY) ?? false)
      : false,
  );

  const wonGame = () => {
    if (typeof window === "undefined") return;
    setIsGameWon(true);
    setWithExpiry(GAME_WON_KEY, true, msUntilMidnightUTC());
  };

  const updateWinsCount = (newCount: number) => {
    setWinsCount(newCount);
  };

  return (
    <GameContext.Provider
      value={{ winsCount, updateWinsCount, isGameWon, wonGame }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
