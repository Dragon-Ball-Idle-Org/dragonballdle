"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useGameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import type { SilhouetteCharacter } from "@/types/guess";
import type { SilhouetteZone } from "@/types/silhouette";

type SilhouetteImageViewerProps = {
  dailyCharacter: SilhouetteCharacter;
  guessCount: number;
  zones?: SilhouetteZone[];
};

const MAX_ZOOM = 12;
const MIN_ZOOM = 1;

const FALLBACK_ZONES: SilhouetteZone[] = [
  { xMin: 0.3, xMax: 0.55, yMin: -0.2, yMax: 0.1, aspectRatio: 1 },
  { xMin: -0.55, xMax: -0.3, yMin: -0.2, yMax: 0.1, aspectRatio: 1 },
  { xMin: 0.2, xMax: 0.4, yMin: -0.6, yMax: -0.3, aspectRatio: 1 },
  { xMin: -0.4, xMax: -0.2, yMin: -0.6, yMax: -0.3, aspectRatio: 1 },
  { xMin: -0.15, xMax: 0.15, yMin: -0.3, yMax: 0.1, aspectRatio: 1 },
];

export function SilhouetteImageViewer({
  dailyCharacter,
  guessCount,
  zones,
}: SilhouetteImageViewerProps) {
  const { isGameWon } = useGameContext();
  const tr = useTranslations("silhouetteViewer") as Record<string, string>;

  const activeZones = zones && zones.length > 0 ? zones : FALLBACK_ZONES;

  const { direction: randomDirection, aspectRatio } = useMemo(() => {
    const initialSeed = dailyCharacter.slug
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);

    // LCG: (seed * a + c) % m
    const s1 = (initialSeed * 9301 + 49297) % 233280;
    const s2 = (s1 * 9301 + 49297) % 233280;
    const s3 = (s2 * 9301 + 49297) % 233280;

    const rng1 = s1 / 233280;
    const rng2 = s2 / 233280;
    const rng3 = s3 / 233280;

    const zoneIndex = Math.floor(rng1 * activeZones.length);
    const zone = activeZones[zoneIndex];

    const dirX = zone.xMin + rng2 * (zone.xMax - zone.xMin);
    const dirY = zone.yMin + rng3 * (zone.yMax - zone.yMin);

    return {
      direction: { x: dirX, y: dirY },
      aspectRatio: zone.aspectRatio || 1,
    };
  }, [dailyCharacter.slug, activeZones]);

  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const maxGuesses = 18;
  const currentZoom = Math.max(
    MIN_ZOOM,
    Math.pow(MAX_ZOOM, Math.max(0, maxGuesses - guessCount) / maxGuesses),
  );

  const maxPanPercent = ((currentZoom - 1) / 2) * 100;

  const { adjX, adjY } = useMemo(() => {
    if (!containerSize) return { adjX: randomDirection.x, adjY: randomDirection.y };
    
    const Rc = containerSize.w / containerSize.h;
    const Ri = aspectRatio;

    if (Ri < Rc) {
      // Pillarbox (tall image) - adjust X
      return { adjX: randomDirection.x * (Ri / Rc), adjY: randomDirection.y };
    } else {
      // Letterbox (wide image) - adjust Y
      return { adjX: randomDirection.x, adjY: randomDirection.y * (Rc / Ri) };
    }
  }, [aspectRatio, containerSize, randomDirection]);

  const currentX = adjX * maxPanPercent;
  const currentY = adjY * maxPanPercent;

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
        (guessCount / maxGuesses) * 100,
      ),
    ),
  );

  const revealLabel = tr.revealPercent.replace("__P__", String(revealPercent));
  const guessLabel =
    guessCount === 1
      ? tr.guessCountOne
      : tr.guessCountMany.replace("__C__", String(guessCount));

  return (
    <div data-testid="silhouette-viewer" className="w-full flex flex-col items-center gap-4 mb-6">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden",
          "bg-radar-green border-2 border-white",
        )}
      >
        {containerSize && (
          <motion.div
            className="absolute inset-0 origin-center bg-scouter-texture"
            initial={false}
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
              className={cn(
                "w-full h-full transition-all duration-500",
                "object-contain p-2",
              )}
              style={{
                filter: !isGameWon
                  ? "contrast(110%) brightness(100%)"
                  : "none",
                willChange: "transform",
              }}
            />
          </motion.div>
        )}

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
