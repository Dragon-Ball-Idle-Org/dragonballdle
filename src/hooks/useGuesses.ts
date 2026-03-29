"use client";

import { getCharacterBySlug } from "@/service/characters";
import { CharacterGuess } from "@/types/guess";
import { useEffect, useState } from "react";

const SLUGS_KEY = "dragonballdle:guesses";
const CACHE_KEY = "dragonballdle:guesses-cache";
const DAY_KEY = "dragonballdle:day";

function loadSlugs(dayIndex: number): string[] {
  if (typeof window === "undefined") return [];
  const storedDay = localStorage.getItem(DAY_KEY);
  if (Number(storedDay) !== dayIndex) {
    localStorage.removeItem(SLUGS_KEY);
    sessionStorage.removeItem(CACHE_KEY);
    localStorage.setItem(DAY_KEY, String(dayIndex));
    return [];
  }
  const stored = localStorage.getItem(SLUGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function loadCachedGuesses(): CharacterGuess[] {
  if (typeof window === "undefined") return [];
  const cached = sessionStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

function saveCachedGuesses(guesses: CharacterGuess[]) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(guesses));
}

export function useGuesses(dayIndex: number, locale: string) {
  const [slugs, setSlugs] = useState<string[]>(() => loadSlugs(dayIndex));
  const [guesses, setGuesses] = useState<CharacterGuess[]>(() =>
    loadCachedGuesses(),
  );
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === "undefined") return false;
    const cached = loadCachedGuesses();
    if (cached.length > 0) return true;
    const slugs = loadSlugs(dayIndex);
    if (!slugs.length) return true;
    return false;
  });

  useEffect(() => {
    if (hydrated) return;

    Promise.all(slugs.map((slug) => getCharacterBySlug(slug, locale))).then(
      (results) => {
        const valid = results.filter(Boolean) as CharacterGuess[];
        setGuesses(valid);
        saveCachedGuesses(valid);
        setHydrated(true);
      },
    );
  }, []);

  const addGuess = (character: CharacterGuess) => {
    setGuesses((prev) => {
      if (prev.some((g) => g.slug === character.slug)) return prev;
      const next = [character, ...prev];
      saveCachedGuesses(next);
      return next;
    });
    setSlugs((prev) => {
      const next = [character.slug, ...prev];
      localStorage.setItem(SLUGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { guesses, addGuess, hydrated };
}
