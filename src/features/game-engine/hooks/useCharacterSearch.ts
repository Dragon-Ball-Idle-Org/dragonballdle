"use client";

import { CharacterSearchResult } from "@/features/game-engine/types/character";
import { useDeferredValue, useEffect, useState, useCallback } from "react";
import { useCharacterCache } from "./useCharacterCache";

export function useCharacterSearch(
  query: string,
  locale: string,
  guesses: string[],
) {
  const [results, setResults] = useState<CharacterSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const deferred = useDeferredValue(query);
  const { findByName } = useCharacterCache(locale);

  // Reset results during render if query is empty
  const [prevDeferred, setPrevDeferred] = useState(deferred);
  if (deferred !== prevDeferred) {
    setPrevDeferred(deferred);
    if (deferred.length < 1 && results.length > 0) {
      setResults([]);
    }
  }

  const handleSearch = useCallback(
    async (controller: AbortController) => {
      if (deferred.length < 1) return;

      const cached = await findByName(deferred);

      if (cached.length > 0) {
        const filtered = cached
          .filter((c) => !guesses.includes(c.slug))
          .map((c) => ({
            slug: c.slug,
            name: c.name,
            thumb_path: c.thumb_path,
          }));
        setResults(filtered);
        return;
      }

      setIsLoading(true);
      fetch(
        `/api/characters/search?q=${encodeURIComponent(deferred)}&locale=${locale.toLowerCase()}`,
        { signal: controller.signal },
      )
        .then((res) => res.json())
        .then((data: CharacterSearchResult[]) =>
          setResults(data.filter((r) => !guesses.includes(r.slug))),
        )
        .catch(() => {})
        .finally(() => setIsLoading(false));
    },
    [deferred, locale, guesses, findByName],
  );

  useEffect(() => {
    if (deferred.length < 1) return;

    const controller = new AbortController();
    handleSearch(controller);
    return () => controller.abort();
  }, [deferred, handleSearch]);

  return { results, isLoading };
}
