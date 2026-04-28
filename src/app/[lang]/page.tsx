import { MartialArtsGameButton } from "@/features/classic/components/MartialArts/MartialArtsGameButton";
import { Header } from "@/components/ui/Header";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <>
      <Header hideBackButton hideNavigation />
      <main className="flex-1 flex h-full flex-col items-center justify-center gap-3 my-3">
        <MartialArtsGameButton
          icon={<p className="font-display text-9xl">?</p>}
          title={t("classic.title")}
          subtitle={t("classic.subtitle")}
          winsCountTemplate={t("winsCount", { count: "[count]" })}
          href="/classic"
          gameMode="classic"
        />

        <MartialArtsGameButton
          icon={<p className="font-display text-9xl">◐</p>}
          title={t("silhouette.title")}
          subtitle={t("silhouette.subtitle")}
          winsCountTemplate={t("winsCount", { count: "[count]" })}
          href="/silhouette"
          gameMode="silhouette"
        />

        {/* <MartialArtsGameButtonDisabled
          icon={<h1 className="font-display text-9xl">X</h1>}
          title={t("inProgress.title")}
          subtitle={t("inProgress.subtitle")}
        /> */}
      </main>
    </>
  );
}
