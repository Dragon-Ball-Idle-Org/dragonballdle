"use client";

import { cn } from "@/utils/cn";
import { WinsBadge } from "../../shared/WinsBadge";
import { useTranslations } from "@/contexts/TranslationContext";
import { useWinsRealtime } from "@/hooks/useWinsRealtime";

export function CapsuleCorpHero() {
  const translations = useTranslations("silhouetteHero");
  const { winsCount, isLoading } = useWinsRealtime("silhouette");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 sm:gap-5 p-4 text-center",
        "w-full max-w-180 my-0 mx-auto p-6 sm:p-4 rounded-2xl overflow-hidden",
        "bg-capsule-corp-texture shadow-hero",
        "border-2 border-white text-white",
      )}
    >
      <h1 className="font-display text-hero-title text-shadow-hero-title drop-shadow-sm">
        {translations.title}
      </h1>
      <span
        className={cn(
          "inline-flex sm:gap-2 font-bold text-hero-subtitle m-0 text-shadow-hero-subtitle text-capsule-corp-bright",
          isLoading ? "items-start" : "items-baseline",
        )}
      >
        <WinsBadge
          count={winsCount ?? 0}
          isLoading={isLoading}
          className="self-center"
        />
        {translations.subtitle}
      </span>
    </div>
  );
}
