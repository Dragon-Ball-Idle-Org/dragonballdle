"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import type { TranslationsBundle } from "@/lib/client-translations";

type TranslationNamespace = keyof TranslationsBundle;

interface TranslationProviderProps {
  children: ReactNode;
  translations: TranslationsBundle;
}

const TranslationContext = createContext<TranslationsBundle | null>(null);

export function TranslationProvider({
  children,
  translations,
}: TranslationProviderProps) {
  const value = useMemo(() => translations, [translations]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations<K extends TranslationNamespace>(
  namespace: K,
): TranslationsBundle[K] {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslations must be used within TranslationProvider");
  }

  return context[namespace];
}

export function useAllTranslations(): TranslationsBundle {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useAllTranslations must be used within TranslationProvider",
    );
  }

  return context;
}
