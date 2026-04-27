"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { CountdownToMidnight } from "@/components/shared/CountdownToMidnight";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { ReactNode } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/contexts/TranslationContext";
import { TranslationNamespace, createT } from "@/lib/client-translations";
import { ShareDropdown } from "@/components/ui/ShareDropdown";
import { ShineGradientButton } from "@/components/ui/ShineGradientButton";
import { EyeIcon } from "@phosphor-icons/react";
import { LeaderboardModal } from "@/components/shared/LeaderboardModal";

type MartialArtsWinBannerProps = {
  todayCharacterSlug: string;
  todayCharacterName: string;
  todayCharacterImage: string;
};

export function MartialArtsWinBanner({
  todayCharacterSlug,
  todayCharacterName,
  todayCharacterImage,
}: MartialArtsWinBannerProps) {
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
              "sm:max-w-[90xw] min-w-80 sm:min-w-130 p-4 sm:p-3 border-martial-arts",
              "bg-primary shadow-[0_8px_20px_#00000042] text-shadow-[1px_1px_3px_rgba(0,0,0,.85)]",
            )}
          >
            <h3 className="text-center text-xl font-black m-0 mb-2 pb-2 border-b-2 border-black/16">
              {t("title")}
            </h3>

            <Row title={t("tries")} value={String(tries)} />
            <Row
              title={t("nextCharacter")}
              value={<CountdownToMidnight className="font-ui font-black" />}
            />

            <div className="w-full flex flex-col items-center justify-center gap-3 border-t border-black/12 pt-3 pb-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="font-bold">{t("todayCharacter")}</span>
                <ShineGradientButton
                  className={cn(
                    "py-2 px-3 shadow-[inset_0_1px_8px_#00000038,0_2px_8px_#0000001f]",
                    "bg-linear-135 from-green-500 to-green-700",
                    "font-ui font-black text-xl text-shadow-[1px_1px_2px_rgba(0,0,0,.6)] whitespace-nowrap",
                  )}
                  shineColor="rgba(74, 222, 128, 0.4)"
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
              <ShareDropdown todayCharacterSlug={todayCharacterSlug} />
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
              <LeaderboardModal
                gameMode="classic"
                currentGuessCount={tries}
              />
            </div>

            <Link
              href="/silhouette"
              className={cn(
                "w-full flex items-center justify-center gap-3 p-6 rounded-2xl relative mt-6 mb-4",
                "bg-amber-400 border-2 border-[#d41919] shadow-[0_6px_0_#b45309]",
                "hover:scale-103 active:scale-95 transition-all",
                "font-display text-2xl uppercase tracking-widest",
              )}
            >
              <EyeIcon weight="fill" className="w-8 h-8 shrink-0" />
              <span className="relative z-10">
                {t("playSilhouette")}
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ title, value }: { title: string; value: string | ReactNode }) {
  return (
    <div className="flex items-center justify-between w-full p-2 border-t border-black/12">
      <span className="font-bold">{title}</span>
      <span
        className="font-ui font-black py-0.5 px-2 rounded-xl outline outline-white/45 bg-black/15"
        suppressHydrationWarning
      >
        {value}
      </span>
    </div>
  );
}
