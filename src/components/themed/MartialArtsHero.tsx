"use client";

import { cn } from "@/utils/cn";
import { WinsBadge } from "../shared/WinsBadge";
import { useTranslations } from "@/contexts/TranslationContext";
import { useWinsRealtime } from "@/hooks/useWinsRealtime";

export function MartialArtsHero() {
  const translations = useTranslations("hero");
  const { winsCount, isLoading } = useWinsRealtime();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 sm:gap-5 p-4 text-center",
        "w-full max-w-180 my-0 mx-auto p-6 sm:p-4",
        "bg-primary bg-[url('/assets/dragon-background-texture.svg')] bg-no-repeat bg-bottom-right bg-cover shadow-hero",
        "border-martial-arts",
      )}
    >
      <h1 className="font-display text-hero-title text-shadow-hero-title">
        {translations.title}
      </h1>
      <span
        className={cn(
          "inline-flex sm:gap-2 font-bold text-hero-subtitle m-0 text-shadow-hero-subtitle",
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
