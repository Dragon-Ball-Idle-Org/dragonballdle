"use client";

import { getCharacterBySlug } from "@/service/characters";
import type { GameMode } from "@/types/game-mode";
import { CharacterGuess } from "@/types/guess";
import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { msUntilMidnightBrasilia } from "@/utils/time";
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
    const item = JSON.parse(raw);
    return item;
  } catch (e) {
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
    if (!slugs.length) {
      setGuesses([]);
      setHydrated(true);
      return;
    }

    const cached = loadCachedGuesses(locale, gameMode);
    if (cached.length === slugs.length) {
      setGuesses(cached);
      setHydrated(true);
      return;
    }

    Promise.all(slugs.map((slug) => getCharacterBySlug(slug, locale)))
      .then((results) => {
        const valid = results.filter(Boolean) as CharacterGuess[];
        setGuesses(valid);
        saveCachedGuesses(valid, locale, gameMode);
        setHydrated(true);
      })
      .catch((err) => {
        console.error("Error hydrating guesses:", err);
        setHydrated(true);
      });
  }, [locale, gameMode]);

  const addGuess = (character: CharacterGuess) => {
    setGuesses((prev) => {
      if (prev.some((g) => g.slug === character.slug)) return prev;
      const next = [character, ...prev];
      saveCachedGuesses(next, locale, gameMode);

      const ttl = msUntilMidnightBrasilia();
      const slugs = loadSlugs(gameMode);
      const nextSlugs = Array.from(new Set([character.slug, ...slugs]));
      setWithExpiry(slugsStorageKey(gameMode), nextSlugs, ttl);

      return next;
    });
  };

  return { guesses, addGuess, hydrated };
}
