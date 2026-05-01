"use client";

import { getCharacterBySlug } from "@/features/game-engine/services/characters";
import type { GameMode } from "@/features/game-engine/types/game-mode";
import { CharacterGuess } from "@/features/game-engine/types/guess";
import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { getMillisecondsUntilTomorrowSaoPaulo } from "@/utils/time";
import { useEffect, useState } from "react";

function slugsStorageKey(gameMode: GameMode) {
  return `dragonballdle:guesses:${gameMode}`;
}

function getCacheKey(locale: string, gameMode: GameMode) {
  return `dragonballdle:guesses-cache:${gameMode}:${locale}`;
}

function loadSlugs(gameMode: GameMode): string[] {
  if (typeof window === "undefined") return [];
  const slugs = getWithExpiry<string[]>(slugsStorageKey(gameMode)) ?? [];
  return Array.from(new Set(slugs));
}

function loadCachedGuesses(locale: string, gameMode: GameMode): CharacterGuess[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(getCacheKey(locale, gameMode));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CharacterGuess[];
  } catch {
    return [];
  }
}

function saveCachedGuesses(
  guesses: CharacterGuess[],
  locale: string,
  gameMode: GameMode,
) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    getCacheKey(locale, gameMode),
    JSON.stringify(guesses),
  );
}

export function useGuesses(locale: string, gameMode: GameMode = "classic") {
  const [guesses, setGuesses] = useState<CharacterGuess[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const slugs = loadSlugs(gameMode);
    
    const finalizeHydration = (data: CharacterGuess[]) => {
      setGuesses(data);
      setHydrated(true);
    };

    if (!slugs.length) {
      finalizeHydration([]);
      return;
    }

    const cached = loadCachedGuesses(locale, gameMode);
    if (cached.length === slugs.length) {
      finalizeHydration(cached);
      return;
    }

    Promise.all(slugs.map((slug) => getCharacterBySlug(slug, locale)))
      .then((results) => {
        const valid = results.filter(Boolean) as CharacterGuess[];
        saveCachedGuesses(valid, locale, gameMode);
        finalizeHydration(valid);
      })
      .catch((err) => {
        console.error("Error hydrating guesses:", err);
        setHydrated(true);
      });
  }, [locale, gameMode]);

  const addGuess = (character: CharacterGuess) => {
    let length = 0;

    setGuesses((prev) => {
      if (prev.some((g) => g.slug === character.slug)) return prev;
      const next = [character, ...prev];
      saveCachedGuesses(next, locale, gameMode);

      const ttl = getMillisecondsUntilTomorrowSaoPaulo();
      const slugs = loadSlugs(gameMode);
      const nextSlugs = Array.from(new Set([character.slug, ...slugs]));
      setWithExpiry(slugsStorageKey(gameMode), nextSlugs, ttl);

      length = next.length;

      return next;
    });

    return length;
  };

  return { guesses, addGuess, hydrated };
}
