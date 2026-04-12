"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { CountdownToMidnight } from "../../shared/CountdownToMidnight";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { ReactNode } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/contexts/TranslationContext";
import { ShareDropdown } from "../../ui/ShareDropdown";
import { ShineGradientButton } from "../../ui/ShineGradientButton";

type CapsuleCorpWinBannerProps = {
  todayCharacterSlug: string;
  todayCharacterName: string;
  todayCharacterImage: string;
  shareVariant?: "classic" | "silhouette";
};

export function CapsuleCorpWinBanner({
  todayCharacterSlug,
  todayCharacterName,
  todayCharacterImage,
  shareVariant = "classic",
}: CapsuleCorpWinBannerProps) {
  const { tries, hydrated } = useGuessesContext();
  const { isGameWon } = useGameContext();
  const translations = useTranslations("winBanner");

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {isGameWon && (
        <motion.div
          className="flex flex-wrap items-center justify-center"
          initial={false}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div
            className={cn(
              "grid auto-rows-max justify-items-center w-full",
              "sm:max-w-[90xw] min-w-80 sm:min-w-130 p-4 sm:p-3 border-2 border-white rounded-2xl",
              "bg-capsule-corp-texture shadow-[0_8px_32px_rgba(2,6,23,0.6)] text-shadow-[1px_1px_3px_rgba(0,0,0,.85)] text-white",
            )}
          >
            <h3 className="text-center text-xl font-black m-0 mb-2 pb-2 border-b-2 border-amber-400/80">
              {translations.title}
            </h3>

            <Row title={translations.tries} value={String(tries)} />
            <Row
              title={translations.nextCharacter}
              value={<CountdownToMidnight className="font-ui font-black" />}
            />

            <div className="w-full flex flex-col items-center justify-center gap-3 pt-3 pb-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="font-bold">{translations.todayCharacter}</span>
                <ShineGradientButton
                  className={cn(
                    "py-2 px-3 shadow-[inset_0_1px_8px_#00000038,0_2px_8px_#10b98144]",
                    "bg-linear-135 from-emerald-400 to-teal-600",
                    "font-ui font-black text-xl text-shadow-[1px_1px_2px_rgba(0,0,0,.6)] whitespace-nowrap",
                  )}
                  shineColor="rgba(16, 185, 129, 0.4)"
                >
                  {todayCharacterName}
                </ShineGradientButton>
              </div>
              <img
                src={todayCharacterImage}
                alt={`${todayCharacterName} thumbnail`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl object-cover shadow-[0_0_0_1px_#ffffffa6,0_4px_14px_#00000047]"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <ShareDropdown
                todayCharacterSlug={todayCharacterSlug}
                variant={shareVariant}
                uiTheme="capsule"
              />
              <Link
                href="https://buymeacoffee.com/dragonballdle"
                target="_blank"
                rel="noopener"
                className={cn(
                  "inline-flex items-center justify-center gap-2 w-full sm:w-auto! max-h-11 rounded-xl p-3",
                  "bg-buy-me-a-coffe shadow-[inset_0_0_0_1px_#fff3,0_6px_14px_#00000040]",
                  "transition-transform ease-linear hover:scale-105",
                )}
              >
                <img
                  src="/assets/buy-me-a-coffe.svg"
                  alt="Buy me a coffe"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <span className="leading-none">{translations.supportUs}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ title, value }: { title: string; value: ReactNode }) {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-2 border-b border-amber-400/80 last:border-b-0 px-2">
      <span className="text-sm font-bold">{title}</span>
      <span className="font-ui font-black text-sm text-right">{value}</span>
    </div>
  );
}
