"use client";

import { SilhouetteImageViewer } from "./SilhouetteImageViewer";
import { CapsuleCorpAutocompleteField } from "./CapsuleCorp/CapsuleCorpAutocompleteField";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacterSearch } from "@/hooks/useCharacterSearch";
import { useLocale } from "next-intl";
import { getCharacterBySlug } from "@/service/characters";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { useGameContext } from "@/contexts/GameContext";
import type { SilhouetteCharacter } from "@/types/guess";
import type { SilhouetteZone } from "@/types/silhouette";
import { useTranslations } from "@/contexts/TranslationContext";
import { useCharacterCache } from "@/hooks/useCharacterCache";
import { hideKeyboard as hideMobileKeyboard } from "@/utils/mobile-behaviors";
import { cn } from "@/utils/cn";
import { incrementWins } from "@/service/wins";
import { recordGuess } from "@/service/leaderboard";
import { ScrambleText } from "../ui/ScrambleText";

export function SilhouetteGameBoard({
  dailyCharacter,
  zones,
}: {
  dailyCharacter: SilhouetteCharacter;
  zones?: SilhouetteZone[];
}) {
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { guesses, addGuess, hydrated } = useGuessesContext();
  const { isGameWon, wonGame } = useGameContext();
  const { findBySlug } = useCharacterCache(locale);
  const [finishedScrambles, setFinishedScrambles] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (hydrated && guesses.length > 0 && finishedScrambles.size === 0) {
      setFinishedScrambles(new Set(guesses.map((g) => g.slug)));
    }
  }, [hydrated]);

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
  };

  const handleScrambleEnd = async (slug: string, isCorrect: boolean) => {
    setFinishedScrambles((prev) => new Set(prev).add(slug));
    if (isCorrect && !isGameWon) {
      wonGame();
      await Promise.all([
        incrementWins("silhouette"),
        recordGuess("silhouette", guesses.length),
      ]);
    }
  };

  const translations = useTranslations("guessForm");

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full max-w-200 p-4 relative z-1",
        "panel-capsule-corp backdrop-blur-md rounded-2xl",
        "[-webkit-overflow-scrolling:touch] [scrollbar-width:thin] snap-x snap-proximity overflow-x-auto",
      )}
    >
      <SilhouetteImageViewer
        dailyCharacter={dailyCharacter}
        guessCount={guesses.length}
        zones={zones}
      />

      <form
        className="sticky top-0 left-0 right-0 w-full flex items-center gap-2 mb-2 bg-transparent overflow-visible z-2"
        onSubmit={(e) => {
          e.preventDefault();
          submitGuess(selectedSlug);
        }}
      >
        <CapsuleCorpAutocompleteField
          className="w-full"
          suggestions={results.map((r) => ({
            id: r.slug,
            name: r.name,
            image: r.thumb_path
              ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${r.thumb_path}`
              : undefined,
          }))}
          onChange={(value: string) => setQuery(value)}
          onSelect={(slug: string) => setSelectedSlug(slug)}
          submitOnSelect
          disabled={hydrated && isGameWon}
          isLoading={isLoading}
        />
        <button
          type="submit"
          className="hidden sm:block cursor-pointer transition-transform hover:scale-105 active:scale-95 -translate-y-[5px]"
        >
          <img
            src="/assets/dragon-radar-icon.png"
            alt={translations.submitAlt}
            width={80}
            height={80}
            className="w-18 h-18"
          />
        </button>
      </form>

      <div className="w-full flex flex-col items-center gap-2 mt-4">
        <AnimatePresence mode="popLayout">
          {guesses.map((guess, idx) => {
            const isCorrect = guess.slug === dailyCharacter.slug;
            const isFinished = finishedScrambles.has(guess.slug);

            return (
              <motion.div
                key={guess.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-xl border-2 shadow-lg transition-colors duration-500",
                  !isFinished
                    ? "bg-slate-900/90 border-radar-yellow/30 shadow-[inset_0_0_10px_rgba(251,191,36,0.1)]"
                    : isCorrect
                      ? "bg-green-600/80 border-green-400"
                      : "bg-red-600/80 border-red-500",
                )}
              >
                <div className="w-12 h-12 relative shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-white/20">
                  {guess.thumb_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${guess.thumb_path}`}
                      alt={guess.name}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        !isFinished
                          ? "grayscale blur-sm opacity-50"
                          : "grayscale-0 blur-0 opacity-100",
                      )}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      ?
                    </div>
                  )}
                </div>

                <div className="font-display text-white text-xl flex-1 text-center truncate px-2 drop-shadow-md">
                  <ScrambleText
                    text={guess.name}
                    animate={!isFinished}
                    duration={1100}
                    onScrambleEnd={() =>
                      handleScrambleEnd(guess.slug, isCorrect)
                    }
                  />
                </div>

                <div className="w-12 h-12 shrink-0" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
