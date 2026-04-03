"use client";

import { createContext, useContext, ReactNode } from "react";
import { useGuesses } from "@/hooks/useGuesses";
import { CharacterGuess } from "@/types/guess";

type GuessesContextValue = {
  guesses: CharacterGuess[];
  addGuess: (character: CharacterGuess) => void;
  hydrated: boolean;
  tries: number;
};

const GuessesContext = createContext<GuessesContextValue | null>(null);

export function GuessesProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const { guesses, addGuess, hydrated } = useGuesses(locale);

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
