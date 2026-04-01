"use client";

import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { createContext, useContext, ReactNode, useState } from "react";

const GAME_WON_KEY = "dragonballdle:game-won";

type GameContextValue = {
  isGameWon: boolean;
  wonGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [isGameWon, setIsGameWon] = useState<boolean>(
    getWithExpiry(GAME_WON_KEY) ?? false,
  );

  const wonGame = () => {
    setIsGameWon(true);
    setWithExpiry(GAME_WON_KEY, true, msUntilMidnightUTC());
  };

  return (
    <GameContext.Provider value={{ isGameWon, wonGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
