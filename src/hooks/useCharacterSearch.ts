import { CharacterSearchResult } from "@/types/character";
import { useDeferredValue, useEffect, useState } from "react";

export function useCharacterSearch(
  query: string,
  locale: string,
  guesses: string[],
) {
  const [results, setResults] = useState<CharacterSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    if (deferred.length < 1 && results.length > 0) {
      setResults([]);
    }

    setIsLoading(true);

    const controller = new AbortController();

    fetch(
      `/api/characters/search?q=${encodeURIComponent(deferred)}&locale=${locale.toLowerCase()}`,
      {
        signal: controller.signal,
      },
    )
      .then((res) => res.json())
      .then((data: CharacterSearchResult[]) =>
        setResults(data.filter((r) => !guesses.includes(r.slug))),
      )
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [deferred, locale, guesses]);

  return { results, isLoading };
}
