import {
  MartialArtsGameButton,
  MartialArtsGameButtonDisabled,
} from "@/components/themed/MartialArts/MartialArtsGameButton";
import { Header } from "@/components/ui/Header";
import { ANONYMOUS_CONTEXT, getFeatureFlag } from "@/lib/feature-flags";
import { TimerIcon } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");

  const showSilhouette = await getFeatureFlag(
    "show-silhouette",
    ANONYMOUS_CONTEXT,
    false,
  );

  return (
    <>
      <Header hideBackButton />
      <main className="flex-1 flex h-full flex-col items-center justify-center gap-3 my-3">
        <MartialArtsGameButton
          icon={<h1 className="font-display text-9xl">?</h1>}
          title={t("classic.title")}
          subtitle={t("classic.subtitle")}
          href="/classic"
        />

        {showSilhouette ? (
          <MartialArtsGameButton
            icon={<h1 className="font-display text-9xl">◐</h1>}
            title={t("silhouette.title")}
            subtitle={t("silhouette.subtitle")}
            href="/silhouette"
          />
        ) : (
          <MartialArtsGameButtonDisabled
            icon={<TimerIcon weight="fill" className="text-8xl" />}
            title={"Debuts today"}
            subtitle={"Coming soon..."}
            countDown={true}
          />
        )}

        {/* <MartialArtsGameButtonDisabled
          icon={<h1 className="font-display text-9xl">X</h1>}
          title={t("inProgress.title")}
          subtitle={t("inProgress.subtitle")}
        /> */}
      </main>
    </>
  );
}
