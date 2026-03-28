import { GameButton, GameButtonDisabled } from "@/components/_UI/GameButton";
import { Header } from "@/components/Header";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <Header hideBackButton />
      <main className="flex-1 flex h-full flex-col items-center justify-center gap-3 my-3">
        <GameButton
          icon={<h1 className="font-display text-9xl">?</h1>}
          title={t("classic.title")}
          subtitle={t("classic.subtitle")}
          href="/classic"
        />

        <GameButtonDisabled
          icon={<h1 className="font-display text-9xl">X</h1>}
          title={t("inProgress.title")}
          subtitle={t("inProgress.subtitle")}
        />
      </main>
    </>
  );
}
