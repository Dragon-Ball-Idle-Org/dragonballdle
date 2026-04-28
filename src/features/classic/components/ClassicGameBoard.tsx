"use client";

import { MartialArtsAutocompleteField } from "./MartialArts/MartialArtsAutocompleteField";
import { useMemo, useState } from "react";
import { useCharacterSearch } from "@/features/game-engine/hooks/useCharacterSearch";
import { useGuessesContext } from "@/features/game-engine/contexts/GuessesContext";
import { useGameContext } from "@/features/game-engine/contexts/GameContext";
import { ClassicCharacter } from "@/features/game-engine/types/guess";
import { useTranslations } from "@/contexts/TranslationContext";
import { hideKeyboard as hideMobileKeyboard } from "@/utils/mobile-behaviors";
import { TranslationNamespace, createT } from "@/lib/client-translations";
import { useGameFlow } from "@/features/game-engine/hooks/useGameFlow";
import { useLocale } from "next-intl";

export function ClassicGameBoard({
  dailyCharacter,
}: {
  dailyCharacter: ClassicCharacter;
}) {
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { guesses, hydrated } = useGuessesContext();
  const { isGameWon } = useGameContext();

  const memoizedGuesses = useMemo(() => guesses.map((g) => g.slug), [guesses]);
  const { results, isLoading } = useCharacterSearch(
    query,
    locale,
    memoizedGuesses,
  );

  const { processGuess } = useGameFlow({
    gameMode: "classic",
    dailyCharacterSlug: dailyCharacter.slug,
    winDelay: 2700,
  });

  const submitGuess = async (slug?: string | null) => {
    hideMobileKeyboard();

    const target = slug || selectedSlug;
    if (!target) return;

    // Clear state immediately to avoid race conditions and double submissions
    setQuery("");
    setSelectedSlug(null);

    await processGuess(target);
  };

  const t = createT(useTranslations("guessForm") as TranslationNamespace);

  return (
    <form
      className="sticky top-0 left-0 right-0 w-full flex items-center gap-2 mb-2 bg-transparent overflow-visible z-2"
      onSubmit={(e) => {
        e.preventDefault();
        submitGuess(selectedSlug);
      }}
    >
      <MartialArtsAutocompleteField
      submitOnSelect
        className="w-full"
        suggestions={results.map((r) => ({
          id: r.slug,
          name: r.name,
          image: r.thumb_path
            ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${r.thumb_path}`
            : undefined,
        }))}
        onChange={(value) => setQuery(value)}
        onSelect={(slug) => {
          setSelectedSlug(slug);
          submitGuess(slug);
        }}
        disabled={hydrated && isGameWon}
        isLoading={isLoading}
      />
      <button
        type="submit"
        className="hidden sm:block cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src="/assets/dragon_ball_4_stars.svg"
          alt={t("submitAlt")}
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </button>
    </form>
  );
}
