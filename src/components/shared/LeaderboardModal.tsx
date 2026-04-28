"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { GuessDistributionChart } from "@/components/shared/GuessDistributionChart";
import { getGuessDistribution } from "@/features/game-engine/services/leaderboard";
import { GameMode } from "@/features/game-engine/types/game-mode";
import { ChartBarIcon } from "@phosphor-icons/react";
import { useTranslations } from "@/contexts/TranslationContext";
import { TranslationNamespace, createT } from "@/lib/client-translations";
import { cn } from "@/utils/cn";

interface LeaderboardModalProps {
  gameMode: GameMode;
  currentGuessCount?: number;
  trigger?: React.ReactNode;
  className?: string;
}

export function LeaderboardModal({
  gameMode,
  currentGuessCount,
  trigger,
  className,
}: LeaderboardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [distribution, setDistribution] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const t = createT(useTranslations("statistics") as TranslationNamespace);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getGuessDistribution(gameMode)
        .then(setDistribution)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, gameMode]);

  return (
    <>
      {trigger || (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all font-display uppercase tracking-wider shadow-lg cursor-pointer hover:scale-105 active:scale-95",
            className,
          )}
        >
          <ChartBarIcon size={24} weight="bold" />
          <span>{t("title")}</span>
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("title")}
        size="lg"
      >
        <div className="p-2">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <GuessDistributionChart
              distribution={distribution}
              currentGuessCount={currentGuessCount}
              gameMode={gameMode}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
