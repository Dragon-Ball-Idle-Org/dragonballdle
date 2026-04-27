"use client";

import { useEffect } from "react";
import { useCharacterCache } from "@/features/game-engine/hooks/useCharacterCache";

export function CacheProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { status } = useCharacterCache(locale);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[cache] locale=${locale} status=${status}`);
    }
  }, [locale, status]);

  return <>{children}</>;
}
