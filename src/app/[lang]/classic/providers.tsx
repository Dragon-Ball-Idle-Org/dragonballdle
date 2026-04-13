import { GameProvider } from "@/contexts/GameContext";
import { GuessesProvider } from "@/contexts/GuessesContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { getTranslationsBundle } from "@/lib/client-translations";

export async function ClassicProviders({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const translations = await getTranslationsBundle([
    "classic",
    "winModal",
    "winBanner",
    "hero",
    "share",
  ]);

  return (
    <TranslationProvider translations={translations}>
      <GuessesProvider locale={locale} gameMode="classic">
        <GameProvider gameMode="classic">{children}</GameProvider>
      </GuessesProvider>
    </TranslationProvider>
  );
}
