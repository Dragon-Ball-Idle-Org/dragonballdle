"use client";

import type { GameMode } from "@/types/game-mode";
import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { msUntilMidnightBrasilia } from "@/utils/time";
import { createContext, useContext, ReactNode, useState } from "react";

function gameWonStorageKey(gameMode: GameMode) {
  return `dragonballdle:game-won:${gameMode}`;
}

type GameContextValue = {
  isGameWon: boolean;
  wonGame: () => void;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  gameMode = "classic",
}: {
  children: ReactNode;
  gameMode?: GameMode;
}) {
  const [isGameWon, setIsGameWon] = useState<boolean>(
    typeof window !== "undefined"
      ? (getWithExpiry(gameWonStorageKey(gameMode)) ?? false)
      : false,
  );

  const wonGame = () => {
    if (typeof window === "undefined") return;
    setIsGameWon(true);
    setWithExpiry(gameWonStorageKey(gameMode), true, msUntilMidnightBrasilia());
    window.dispatchEvent(new Event("game-won-changed"));
  };

  return (
    <GameContext.Provider
      value={{ isGameWon, wonGame }}
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
