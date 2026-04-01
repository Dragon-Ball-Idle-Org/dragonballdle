"use client";

import { getCharacterBySlug } from "@/service/characters";
import { CharacterGuess } from "@/types/guess";
import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { msUntilMidnightUTC } from "@/utils/time";
import { useEffect, useState } from "react";

const SLUGS_KEY = "dragonballdle:guesses";
const CACHE_KEY = "dragonballdle:guesses-cache";

function loadSlugs(): string[] {
  if (typeof window === "undefined") return [];
  const cached = sessionStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

function loadCachedGuesses(): CharacterGuess[] {
  if (typeof window === "undefined") return [];
  return getWithExpiry<CharacterGuess[]>(CACHE_KEY) ?? [];
}

function saveCachedGuesses(guesses: CharacterGuess[]) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(guesses));
}

export function useGuesses(locale: string) {
  const [guesses, setGuesses] = useState<CharacterGuess[]>(() =>
    loadCachedGuesses(),
  );

  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === "undefined") return false;
    const cached = loadCachedGuesses();
    if (cached.length > 0) return true;
    const slugs = loadSlugs();
    if (!slugs.length) return true;
    return false;
  });

  useEffect(() => {
    if (hydrated) return;

    Promise.all(
      loadSlugs().map((slug) => getCharacterBySlug(slug, locale)),
    ).then((results) => {
      const valid = results.filter(Boolean) as CharacterGuess[];
      setGuesses(valid);
      saveCachedGuesses(valid);
      setHydrated(true);
    });
  }, []);

  const addGuess = (character: CharacterGuess) => {
    setGuesses((prev) => {
      if (prev.some((g) => g.slug === character.slug)) return prev;
      const next = [character, ...prev];
      saveCachedGuesses(next);

      const ttl = msUntilMidnightUTC();
      const slugs = loadSlugs();
      if (!slugs.length) {
        setWithExpiry(SLUGS_KEY, [character.slug], ttl);
      }

      return next;
    });
  };

  return { guesses, addGuess, hydrated };
}
