import { GameProvider } from "@/contexts/GameContext";
import { GuessesProvider } from "@/contexts/GuessesContext";

export function ClassicProviders({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <GuessesProvider locale={locale}>
      <GameProvider>{children}</GameProvider>
    </GuessesProvider>
  );
}
