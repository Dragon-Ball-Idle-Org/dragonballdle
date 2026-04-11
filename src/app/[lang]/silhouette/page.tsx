import { MainContainer } from "@/components/ui/MainContainer";
import { CapsuleCorpHero } from "@/components/themed/CapsuleCorpHero";
import { CapsuleCorpYesterdayCharacter } from "@/components/themed/CapsuleCorpYesterdayCharacter";
import { CapsuleCorpWinBanner } from "@/components/themed/CapsuleCorpWinBanner";
import { SilhouetteGameBoard } from "@/components/themed/SilhouetteGameBoard";
import {
  getDailyCharacter,
  getDailySilhouetteCharacter,
  getYesterdayCharacter,
  getYesterdaySilhouetteCharacter,
} from "@/service/daily";
import { getLocale, getTranslations } from "next-intl/server";
import { WinModal } from "@/components/shared/WinModal";

export default async function SilhouettePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "silhouette" });
  const dailyChar = await getDailySilhouetteCharacter(locale);
  const yesterdayChar = await getYesterdaySilhouetteCharacter(locale);

  if (!dailyChar) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1>{t("dailyNotFound")}</h1>
      </div>
    );
  }

  return (
    <>
      <WinModal
        characterName={dailyChar.name}
        characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.image_path}`}
      />

      <MainContainer>
        <CapsuleCorpHero />
        {yesterdayChar && (
          <CapsuleCorpYesterdayCharacter
            characterName={yesterdayChar.name}
            characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${yesterdayChar.image_path}`}
          />
        )}
        <CapsuleCorpWinBanner
          todayCharacterSlug={dailyChar.slug}
          todayCharacterName={dailyChar.name}
          todayCharacterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.silhouette_path}`}
          shareVariant="silhouette"
        />
        <SilhouetteGameBoard dailyCharacter={dailyChar} />
      </MainContainer>
    </>
  );
}
