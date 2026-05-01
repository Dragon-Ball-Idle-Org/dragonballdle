"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { CountdownToMidnight } from "@/components/shared/CountdownToMidnight";
import { useGuessesContext } from "@/features/game-engine/contexts/GuessesContext";
import { ReactNode } from "react";
import { useGameContext } from "@/features/game-engine/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/contexts/TranslationContext";
import { TranslationNamespace, createT } from "@/lib/client-translations";
import { ShareDropdown } from "@/components/ui/ShareDropdown";
import { ShineGradientButton } from "@/components/ui/ShineGradientButton";
import { LeaderboardModalClient } from "@/components/shared/LeaderboardModalClient";
import { GameMode } from "@/features/game-engine/types/game-mode";

type CapsuleCorpWinBannerProps = {
  todayCharacterSlug: string;
  todayCharacterName: string;
  todayCharacterImage: string;
  shareVariant?: "classic" | "silhouette";
  playNextLabel?: string;
};

export function CapsuleCorpWinBanner({
  todayCharacterSlug,
  todayCharacterName,
  todayCharacterImage,
  shareVariant = "classic",
  playNextLabel,
}: CapsuleCorpWinBannerProps) {
  const { tries, hydrated } = useGuessesContext();
  const { isGameWon } = useGameContext();
  const t = createT(useTranslations("winBanner") as TranslationNamespace);

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
              "bg-capsule-corp-texture-square shadow-[0_8px_32px_rgba(2,6,23,0.6)] text-shadow-[1px_1px_3px_rgba(0,0,0,.85)] text-white",
            )}
          >
            <h3 className="text-center text-xl font-black m-0 mb-2 pb-2 border-b-2 border-amber-400/80">
              {t("title")}
            </h3>

            <Row title={t("tries")} value={String(tries)} />
            <Row
              title={t("nextCharacter")}
              value={<CountdownToMidnight className="font-ui font-black" />}
            />

            <div className="w-full flex flex-col items-center justify-center gap-3 pt-3 pb-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="font-bold">{t("todayCharacter")}</span>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full">
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
                <span className="leading-none">{t("supportUs")}</span>
              </Link>
            </div>

            <div className="w-full mt-4 flex justify-center">
              <LeaderboardModalClient
                gameMode={shareVariant as GameMode}
                currentGuessCount={tries}
              />
            </div>

            {playNextLabel && (
              <Link
                href="/classic"
                className={cn(
                  "w-full flex items-center justify-center gap-4 p-5 rounded-2xl relative mt-5 mb-2 overflow-hidden",
                  "bg-zinc-900 border-2 border-green-500 shadow-[0_6px_0_#15803d,0_0_15px_rgba(34,197,94,0.3)]",
                  "hover:scale-103 hover:shadow-[0_6px_0_#15803d,0_0_25px_rgba(34,197,94,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#15803d] transition-all text-white",
                  "font-display text-2xl uppercase tracking-widest text-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]",
                )}
              >
                <div className="absolute w-[150%] h-px bg-green-500/20 rotate-45 pointer-events-none" />
                <div className="absolute w-[150%] h-px bg-green-500/20 -rotate-45 pointer-events-none" />
                <div className="absolute inset-0 border border-green-500/20 rounded-full scale-[2] pointer-events-none" />

                <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mr-1">
                  <div className="absolute w-4 h-4 bg-green-400 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-green-400 rounded-full z-10" />
                </div>

                <span className="relative z-10">
                  {playNextLabel}
                </span>
              </Link>
            )}
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
