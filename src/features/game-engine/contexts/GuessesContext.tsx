"use client";

import { createContext, useContext, ReactNode } from "react";
import { useGuesses } from "@/features/game-engine/hooks/useGuesses";
import type { GameMode } from "@/features/game-engine/types/game-mode";
import { CharacterGuess } from "@/features/game-engine/types/guess";

type GuessesContextValue = {
  guesses: CharacterGuess[];
  addGuess: (character: CharacterGuess) => number;
  hydrated: boolean;
  tries: number;
};

export const GuessesContext = createContext<GuessesContextValue | null>(null);

export function GuessesProvider({
  locale,
  gameMode = "classic",
  children,
}: {
  locale: string;
  gameMode?: GameMode;
  children: ReactNode;
}) {
  const { guesses, addGuess, hydrated } = useGuesses(locale, gameMode);

  return (
    <GuessesContext.Provider
      value={{ guesses, addGuess, hydrated, tries: guesses.length }}
    >
      {children}
    </GuessesContext.Provider>
  );
}

export function useGuessesContext() {
  const ctx = useContext(GuessesContext);
  if (!ctx)
    throw new Error("useGuessesContext must be used within GuessesProvider");
  return ctx;
}
