"use client";

import { cn } from "@/utils/cn";
import { WinsBadge } from "../shared/WinsBadge";
import { getWinsCount } from "@/service/wins";
import { useGameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import { useEffect } from "react";

export function MartialArtsHero() {
  const translations = useTranslations("hero");
  const { winsCount, updateWinsCount } = useGameContext();

  useEffect(() => {
    getWinsCount().then((count) => {
      if (typeof window === "undefined") return;
      updateWinsCount(count);
    });
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 p-4 text-center",
        "w-full max-w-180 my-0 mx-auto p-4",
        "bg-primary bg-[url('/assets/dragon-background-texture.svg')] bg-no-repeat bg-bottom-right bg-cover shadow-hero",
        "border-martial-arts",
      )}
    >
      <h1 className="font-display text-hero-title text-shadow-hero-title">
        {translations.title}
      </h1>
      <span className="inline-flex items-baseline gap-2 font-bold text-hero-subtitle m-0 text-shadow-hero-subtitle">
        <WinsBadge count={winsCount ?? 0} className="self-center" />
        {translations.subtitle}
      </span>
    </div>
  );
}
