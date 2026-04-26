import { GameProvider } from "@/contexts/GameContext";
import { GuessesProvider } from "@/contexts/GuessesContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { getTranslationsBundle } from "@/lib/client-translations";

export async function SilhouetteProviders({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const translations = await getTranslationsBundle([
    "silhouette",
    "silhouetteHero",
    "silhouetteViewer",
    "winModal",
    "winBanner",
    "share",
    "statistics",
  ]);

  return (
    <TranslationProvider translations={translations}>
      <GuessesProvider locale={locale} gameMode="silhouette">
        <GameProvider gameMode="silhouette">{children}</GameProvider>
      </GuessesProvider>
    </TranslationProvider>
  );
}
