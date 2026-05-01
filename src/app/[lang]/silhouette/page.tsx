import { MainContainer } from "@/components/ui/MainContainer";
import { CapsuleCorpHero } from "@/features/silhouette/components/CapsuleCorp/CapsuleCorpHero";
import { CapsuleCorpYesterdayCharacter } from "@/features/silhouette/components/CapsuleCorp/CapsuleCorpYesterdayCharacter";
import { SilhouetteGameBoard } from "@/features/silhouette/components/SilhouetteGameBoard";
import {
  getDailySilhouetteCharacter,
  getYesterdaySilhouetteCharacter,
} from "@/features/game-engine/services/daily";
import { getLocale, getTranslations } from "next-intl/server";
import { getSilhouetteZones } from "@/lib/silhouette-zones";
import { WinModalClient } from "@/components/shared/WinModalClient";
import { CapsuleCorpWinBannerClient } from "@/features/silhouette/components/CapsuleCorp/CapsuleCorpWinBannerClient";

export const revalidate = 3600;

export default async function SilhouettePage() {
  const locale = await getLocale();
  const [t, tHome, dailyChar, yesterdayChar] = await Promise.all([
    getTranslations({ locale, namespace: "silhouette" }),
    getTranslations({ locale, namespace: "home.classic" }),
    getDailySilhouetteCharacter(locale),
    getYesterdaySilhouetteCharacter(locale),
  ]);

  if (!dailyChar) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1>{t("dailyNotFound")}</h1>
      </div>
    );
  }

  const zones = await getSilhouetteZones(dailyChar.silhouette_path);

  return (
    <>
      <WinModalClient
        characterName={dailyChar.name}
        characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.thumb_path}`}
        playNextLabel={`${tHome("title")}!`}
      />

      <MainContainer>
        <CapsuleCorpHero />
        {yesterdayChar && (
          <CapsuleCorpYesterdayCharacter
            characterName={yesterdayChar.name}
            characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${yesterdayChar.thumb_path}`}
          />
        )}
        <CapsuleCorpWinBannerClient
          todayCharacterSlug={dailyChar.slug}
          todayCharacterName={dailyChar.name}
          todayCharacterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.thumb_path}`}
          shareVariant="silhouette"
          playNextLabel={tHome("title") + "!"}
        />
        <SilhouetteGameBoard dailyCharacter={dailyChar} zones={zones} />
      </MainContainer>
    </>
  );
}
