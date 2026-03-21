import { GameButton, GameButtonDisabled } from "@/components/_UI/GameButton";
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  const currentLocale = useLocale();

  return (
    <main className="flex-1 flex h-full flex-col items-center justify-center gap-3">
      <GameButton
        icon={<h1 className="font-display text-9xl">?</h1>}
        title={t("classic.title")}
        subtitle={t("classic.subtitle")}
        href={`https://classic.dragonballdle.site/${currentLocale.toLowerCase()}`}
      />

      <GameButtonDisabled
        icon={<h1 className="font-display text-9xl">X</h1>}
        title={t("inProgress.title")}
        subtitle={t("inProgress.subtitle")}
      />
    </main>
  );
}
