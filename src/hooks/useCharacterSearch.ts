"use client";

import { CharacterSearchResult } from "@/types/character";
import { useDeferredValue, useEffect, useState } from "react";
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

  const handleSearch = async (controller: AbortController) => {
    if (deferred.length < 1) {
      if (results.length > 0) setResults([]);
      return;
    }

    const cached = await findByName(deferred);

    if (cached.length > 0) {
      setResults(
        cached
          .filter((c) => !guesses.includes(c.slug))
          .map((c) => ({
            slug: c.slug,
            name: c.name,
            thumb_path: c.thumb_path,
          })),
      );
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
  };

  useEffect(() => {
    const controller = new AbortController();
    handleSearch(controller);
    return () => controller.abort();
  }, [deferred, locale, guesses]);

  return { results, isLoading };
}
