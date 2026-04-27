"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/contexts/TranslationContext";
import { TranslationNamespace, createT } from "@/lib/client-translations";
import { cn } from "@/utils/cn";
import { TrophyIcon } from "@phosphor-icons/react";

interface GuessDistributionChartProps {
  distribution: Record<number, number>;
  currentGuessCount?: number;
  gameMode: string;
}

export function GuessDistributionChart({
  distribution,
  currentGuessCount,
}: GuessDistributionChartProps) {
  const t = createT(useTranslations("statistics") as TranslationNamespace);

  const displayBuckets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const processedDistribution = { ...distribution };
  const plusTenCount = Object.entries(distribution).reduce((acc, [key, val]) => {
    return Number(key) >= 10 ? acc + val : acc;
  }, 0);
  processedDistribution[10] = plusTenCount;

  const maxInBucket = Math.max(...Object.values(processedDistribution), 1);
  const totalWins = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full flex flex-col gap-3 p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 mb-2">
        <TrophyIcon className="text-orange-400 w-6 h-6" weight="fill" />
        <h3 className="font-display text-2xl text-white tracking-wider uppercase">
          {t("title")}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {displayBuckets.map((bucket) => {
          const count = processedDistribution[bucket] || 0;
          const isCurrent =
            bucket === 10
              ? (currentGuessCount ?? 0) >= 10
              : currentGuessCount === bucket;
          const percentage = (count / maxInBucket) * 100;

          return (
            <div key={bucket} className="flex items-center gap-3 w-full group">
              <span className="font-display text-white text-lg w-6 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                {bucket === 10 ? "10+" : bucket}
              </span>

              <div className="flex-1 h-8 bg-slate-800/50 rounded-md overflow-hidden relative border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(percentage, 5)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-full flex items-center justify-end px-3 transition-colors",
                    isCurrent
                      ? "bg-linear-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]"
                      : "bg-slate-700 group-hover:bg-slate-600",
                  )}
                >
                  <span
                    className={cn(
                      "font-bold text-sm",
                      isCurrent ? "text-white" : "text-slate-300",
                    )}
                  >
                    {count}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-slate-400 text-xs uppercase tracking-widest font-medium">
        <span>{t("totalWins")}</span>
        <span className="text-white font-display text-lg">{totalWins}</span>
      </div>
    </div>
  );
}
