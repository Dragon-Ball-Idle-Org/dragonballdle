"use client";

import Image from "next/image";
import { MartialArtsAutocompleteField } from "./MartialArtsAutocompleteField";
import { useState } from "react";
import { useCharacterSearch } from "@/hooks/useCharacterSearch";
import { useLocale } from "next-intl";
import { getCharacterBySlug } from "@/service/characters";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { useGameContext } from "@/contexts/GameContext";
import { ClassicCharacter } from "@/types/guess";

export function MartialArtsGuessForm({
  dailyCharacter,
}: {
  dailyCharacter: ClassicCharacter;
}) {
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { guesses, addGuess } = useGuessesContext();
  const { isGameWon, wonGame } = useGameContext();
  const [inputEnabled, setInputEnabled] = useState(!isGameWon);

  const results = useCharacterSearch(
    query,
    locale,
    guesses.map((g) => g.slug),
  );

  const submitGuess = async (slug: string | null) => {
    const target = slug ?? selectedSlug;
    if (!target) return;

    const character = await getCharacterBySlug(target, locale);
    if (!character) return;

    addGuess(character);
    setQuery("");
    setSelectedSlug(null);

    if (character.slug === dailyCharacter.slug) {
      wonGame();
    }
  };

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
        disabled={!inputEnabled}
      />
      <button
        type="submit"
        className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <Image
          src="/assets/dragon_ball_4_stars.svg"
          alt="4 Starts Dragon Ball"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </button>
    </form>
  );
}
