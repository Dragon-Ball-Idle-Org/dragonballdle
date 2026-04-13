"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { useGameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import type { SilhouetteCharacter } from "@/types/guess";

type SilhouetteImageViewerProps = {
  dailyCharacter: SilhouetteCharacter;
  guessCount: number;
};

const MAX_ZOOM = 4;
const MIN_ZOOM = 1;

export function SilhouetteImageViewer({
  dailyCharacter,
  guessCount,
}: SilhouetteImageViewerProps) {
  const { isGameWon } = useGameContext();
  const tr = useTranslations("silhouetteViewer");

  const {
    zoom: initialZoom,
    direction: randomDirection,
    decrement,
  } = useMemo(() => {
    let seed = dailyCharacter.slug
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const initialZ = MAX_ZOOM + rng() * 0.5;

    // Zonas de interesse mapeadas (evitando o topo/cabeça na medida > 0.1 e extremos vazios)
    const zones = [
      // Braço/Lado Esquerdo (Move câmera p/ direita -> x > 0)
      { xMin: 0.3, xMax: 0.55, yMin: -0.2, yMax: 0.1 },
      // Braço/Lado Direito
      { xMin: -0.55, xMax: -0.3, yMin: -0.2, yMax: 0.1 },
      // Perna/Pé Esquerdo
      { xMin: 0.2, xMax: 0.4, yMin: -0.6, yMax: -0.3 },
      // Perna/Pé Direito
      { xMin: -0.4, xMax: -0.2, yMin: -0.6, yMax: -0.3 },
      // Torso Central (Variação um pouco menor p/ não focar só nos extremos)
      { xMin: -0.15, xMax: 0.15, yMin: -0.3, yMax: 0.1 },
    ];

    const zoneIndex = Math.floor(rng() * zones.length);
    const zone = zones[zoneIndex];

    const dirX = zone.xMin + rng() * (zone.xMax - zone.xMin);
    const dirY = zone.yMin + rng() * (zone.yMax - zone.yMin);

    const dynamicDecrement = (initialZ - MIN_ZOOM) / 18;

    return {
      zoom: initialZ,
      direction: { x: dirX, y: dirY },
      decrement: dynamicDecrement,
    };
  }, [dailyCharacter.slug]);

  const currentZoom = Math.max(MIN_ZOOM, initialZoom - guessCount * decrement);

  const maxPanPercent = ((currentZoom - 1) / 2) * 100;
  const currentX = randomDirection.x * maxPanPercent;
  const currentY = randomDirection.y * maxPanPercent;

  const silhouetteImage = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyCharacter.silhouette_path}`;
  const characterImage = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyCharacter.silhouette_colored_path}`;
  const imageUrlToShow = useMemo(
    () => `${isGameWon ? characterImage : silhouetteImage}`,
    [isGameWon, characterImage, silhouetteImage],
  );

  const revealPercent = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        ((initialZoom - currentZoom) / (initialZoom - MIN_ZOOM)) * 100,
      ),
    ),
  );

  const revealLabel = tr.revealPercent.replace("__P__", String(revealPercent));
  const guessLabel =
    guessCount === 1
      ? tr.guessCountOne
      : tr.guessCountMany.replace("__C__", String(guessCount));

  return (
    <div className="w-full flex flex-col items-center gap-4 mb-6">
      <div
        className={cn(
          "relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden",
          "bg-radar-green border-2 border-white",
        )}
      >
        <motion.div
          className="absolute inset-0 origin-center bg-scouter-texture"
          initial={{
            scale: isGameWon ? 1 : currentZoom,
            x: isGameWon ? "0%" : `${currentX}%`,
            y: isGameWon ? "0%" : `${currentY}%`,
          }}
          animate={{
            scale: isGameWon ? 1 : currentZoom,
            x: isGameWon ? "0%" : `${currentX}%`,
            y: isGameWon ? "0%" : `${currentY}%`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src={imageUrlToShow}
            alt={
              isGameWon
                ? tr.imageAltRevealed.replace("__NAME__", dailyCharacter.name)
                : tr.imageAltDaily
            }
            className={cn("w-full h-full object-contain p-2")}
          />
        </motion.div>

        <div className="absolute top-4 right-4 bg-slate-950/85 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
          {revealLabel}
        </div>
      </div>

      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-900/80 rounded-full overflow-hidden border border-emerald-500/40">
          <motion.div
            className="h-full bg-linear-135 from-emerald-300 via-emerald-500 to-teal-700 rounded-full"
            animate={{
              width: `${revealPercent}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          />
        </div>
        <span className="text-xs font-bold text-emerald-200 whitespace-nowrap drop-shadow-sm">
          {guessLabel}
        </span>
      </div>

      {isGameWon && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-emerald-300"
        >
          ✓ {tr.characterRevealed}
        </motion.p>
      )}
    </div>
  );
}
