"use client";

import { getCharacterBySlug } from "@/service/characters";
import { CharacterGuess } from "@/types/guess";
import { getWithExpiry, setWithExpiry } from "@/utils/storage";
import { msUntilMidnightBrasilia } from "@/utils/time";
import { useEffect, useState } from "react";

const SLUGS_KEY = "dragonballdle:guesses";
const CACHE_KEY_PREFIX = "dragonballdle:guesses-cache";

function getCacheKey(locale: string) {
  return `${CACHE_KEY_PREFIX}:${locale}`;
}

function loadSlugs(): string[] {
  if (typeof window === "undefined") return [];
  const slugs = getWithExpiry<string[]>(SLUGS_KEY) ?? [];
  return Array.from(new Set(slugs));
}

function loadCachedGuesses(locale: string): CharacterGuess[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(getCacheKey(locale));
  if (!raw) return [];
  try {
    const item = JSON.parse(raw);
    return item;
  } catch (e) {
    return [];
  }
}

function saveCachedGuesses(guesses: CharacterGuess[], locale: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(getCacheKey(locale), JSON.stringify(guesses));
}

export function useGuesses(locale: string) {
  const [guesses, setGuesses] = useState<CharacterGuess[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const slugs = loadSlugs();
    if (!slugs.length) {
      setGuesses([]);
      setHydrated(true);
      return;
    }

    const cached = loadCachedGuesses(locale);
    if (cached.length === slugs.length) {
      setGuesses(cached);
      setHydrated(true);
      return;
    }

    Promise.all(slugs.map((slug) => getCharacterBySlug(slug, locale))).then(
      (results) => {
        const valid = results.filter(Boolean) as CharacterGuess[];
        setGuesses(valid);
        saveCachedGuesses(valid, locale);
        setHydrated(true);
      },
    );
  }, [locale]);

  const addGuess = (character: CharacterGuess) => {
    setGuesses((prev) => {
      if (prev.some((g) => g.slug === character.slug)) return prev;
      const next = [character, ...prev];
      saveCachedGuesses(next, locale);

      const ttl = msUntilMidnightBrasilia();
      const slugs = loadSlugs();
      const nextSlugs = Array.from(new Set([character.slug, ...slugs]));
      setWithExpiry(SLUGS_KEY, nextSlugs, ttl);

      return next;
    });
  };

  return { guesses, addGuess, hydrated };
}
