"use client";

import { useGuessesContext } from "../contexts/GuessesContext";
import { useGameContext } from "../contexts/GameContext";
import { useCharacterCache } from "./useCharacterCache";
import { getCharacterBySlug } from "../services/characters";
import { incrementWins } from "../services/wins";
import { recordGuess } from "../services/leaderboard";
import { GameMode } from "../types/game-mode";
import { CharacterGuess } from "../types/guess";
import { useLocale } from "next-intl";

interface GameFlowOptions {
  gameMode: GameMode;
  dailyCharacterSlug: string;
  onWin?: (tries: number) => void;
  winDelay?: number;
  checkWinOnGuess?: boolean;
}

export function useGameFlow({
  gameMode,
  dailyCharacterSlug,
  onWin,
  winDelay = 0,
  checkWinOnGuess = true,
}: GameFlowOptions) {
  const locale = useLocale();
  const { addGuess } = useGuessesContext();
  const { wonGame } = useGameContext();
  const { findBySlug } = useCharacterCache(locale);

  const processGuess = async (slug: string): Promise<CharacterGuess | null> => {
    const character =
      (await findBySlug(slug)) || (await getCharacterBySlug(slug, locale));

    if (!character) return null;

    const tries = addGuess(character);

    if (checkWinOnGuess && character.slug === dailyCharacterSlug) {
      setTimeout(async () => {
        wonGame();
        onWin?.(tries);
        await Promise.all([
          incrementWins(gameMode),
          recordGuess(gameMode, tries),
        ]);
      }, winDelay);
    }

    return character;
  };

  /**
   * For games where win logic is deferred (e.g., after an animation)
   */
  const handleWin = async (tries: number) => {
    wonGame();
    onWin?.(tries);
    await Promise.all([
      incrementWins(gameMode),
      recordGuess(gameMode, tries),
    ]);
  };

  return {
    processGuess,
    handleWin,
  };
}
