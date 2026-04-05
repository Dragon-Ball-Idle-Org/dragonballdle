"use client";

import { MartialArtsAutocompleteField } from "./MartialArtsAutocompleteField";
import { useMemo, useState } from "react";
import { useCharacterSearch } from "@/hooks/useCharacterSearch";
import { useLocale } from "next-intl";
import { getCharacterBySlug } from "@/service/characters";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { useGameContext } from "@/contexts/GameContext";
import { ClassicCharacter } from "@/types/guess";
import { useTranslations } from "@/contexts/TranslationContext";
import { incrementWins } from "@/service/wins";
import { useCharacterCache } from "@/hooks/useCharacterCache";
import { hideKeyboard as hideMobileKeyboard } from "@/utils/mobile-behaviors";

export function MartialArtsGuessForm({
  dailyCharacter,
}: {
  dailyCharacter: ClassicCharacter;
}) {
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { guesses, addGuess, hydrated } = useGuessesContext();
  const { isGameWon, wonGame } = useGameContext();
  const { findBySlug } = useCharacterCache(locale);

  const memoizedGuesses = useMemo(() => guesses.map((g) => g.slug), [guesses]);
  const { results, isLoading } = useCharacterSearch(
    query,
    locale,
    memoizedGuesses,
  );

  const submitGuess = async (slug: string | null) => {
    hideMobileKeyboard();

    const target = slug ?? selectedSlug;
    if (!target) return;

    const character =
      (await findBySlug(target)) ?? (await getCharacterBySlug(target, locale));
    if (!character) return;

    addGuess(character);
    setQuery("");
    setSelectedSlug(null);

    if (character.slug === dailyCharacter.slug) {
      // Wait guess animation ends to show win screen
      setTimeout(async () => {
        wonGame();
        await incrementWins();
      }, 2700);
    }
  };

  const translations = useTranslations("guessForm");

  return (
    <form
      className="sticky top-0 left-0 right-0 w-full flex items-center gap-2 mb-2 bg-transparent overflow-visible z-2"
      onSubmit={(e) => {
        e.preventDefault();
        submitGuess(selectedSlug);
      }}
    >
      <MartialArtsAutocompleteField
        className="w-full"
        suggestions={results.map((r) => ({
          id: r.slug,
          name: r.name,
          image: r.thumb_path
            ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${r.thumb_path}`
            : undefined,
        }))}
        onChange={(value) => setQuery(value)}
        onSelect={(slug) => setSelectedSlug(slug)}
        submitOnSelect
        disabled={hydrated && isGameWon}
        isLoading={isLoading}
      />
      <button
        type="submit"
        className="hidden sm:block cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src="/assets/dragon_ball_4_stars.svg"
          alt={translations.submitAlt}
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </button>
    </form>
  );
}
