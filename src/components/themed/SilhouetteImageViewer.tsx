"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { ClassicCharacter } from "@/types/guess";
import { cn } from "@/utils/cn";
import { useGameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";

type SilhouetteImageViewerProps = {
  dailyCharacter: ClassicCharacter;
  guessCount: number;
};

const MAX_ZOOM = 4; // 4x zoom (start with zoomed in)
const MIN_ZOOM = 1; // 1x zoom (full view)
const ZOOM_DECREMENT = 0.3; // Decrease zoom by 30% each wrong guess

export function SilhouetteImageViewer({
  dailyCharacter,
  guessCount,
}: SilhouetteImageViewerProps) {
  const { isGameWon } = useGameContext();
  const tr = useTranslations("silhouetteViewer");

  // Initialize zoom with a random position
  const initialZoom = useMemo(() => {
    return MAX_ZOOM + Math.random() * 0.5; // Slightly randomize initial zoom
  }, []);

  const randomPosition = useMemo(
    () => ({
      x: Math.random() * (MAX_ZOOM - 1) * 100,
      y: Math.random() * (MAX_ZOOM - 1) * 100,
    }),
    [],
  );

  // Calculate current zoom based on wrong guesses
  const currentZoom = Math.max(
    MIN_ZOOM,
    initialZoom - guessCount * ZOOM_DECREMENT,
  );

  const characterImage = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyCharacter.image_path}`;
  const silhouetteImageUrl = `${characterImage}?auto=format&w=600&h=800&fit=crop&q=80`;

  const revealPercent = Math.round(
    Math.max(0, (1 - currentZoom / MAX_ZOOM) * 100),
  );

  const revealLabel = tr.revealPercent.replace("__P__", String(revealPercent));
  const guessLabel =
    guessCount === 1
      ? tr.guessCountOne
      : tr.guessCountMany.replace("__C__", String(guessCount));

  return (
    <div className="w-full flex flex-col items-center gap-4 mb-6">
      {/* Silhouette Display Area */}
      <div
        className={cn(
          "relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden",
          "bg-slate-950 border-capsule-corp-viewport border-2 border-sky-500/50",
        )}
      >
        {/* Image Container with Zoom */}
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{
            scale: isGameWon ? 1 : currentZoom,
            x: isGameWon ? 0 : `${randomPosition.x * -0.01 * currentZoom}px`,
            y: isGameWon ? 0 : `${randomPosition.y * -0.01 * currentZoom}px`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src={silhouetteImageUrl}
            alt={
              isGameWon
                ? tr.imageAltRevealed.replace("__NAME__", dailyCharacter.name)
                : tr.imageAltDaily
            }
            className={cn(
              "w-full h-full object-cover",
              isGameWon ? "filter-none" : "filter brightness-0 contrast-110",
            )}
            style={{
              filter: isGameWon ? "none" : "brightness(0) contrast(110%)",
            }}
          />
        </motion.div>

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-slate-950/85 px-3 py-1 rounded-full text-xs font-bold text-sky-200 border border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]">
          {revealLabel}
        </div>
      </div>

      {/* Reveal Progress */}
      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-900/80 rounded-full overflow-hidden border border-sky-500/40">
          <motion.div
            className="h-full bg-linear-135 from-sky-300 via-sky-500 to-blue-700 rounded-full"
            animate={{
              width: `${revealPercent}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          />
        </div>
        <span className="text-xs font-bold text-sky-200 whitespace-nowrap drop-shadow-sm">
          {guessLabel}
        </span>
      </div>

      {/* Status Text */}
      {isGameWon && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-sky-300"
        >
          ✓ {tr.characterRevealed}
        </motion.p>
      )}
    </div>
  );
}
