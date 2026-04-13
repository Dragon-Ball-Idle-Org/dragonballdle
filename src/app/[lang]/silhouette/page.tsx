import { MainContainer } from "@/components/ui/MainContainer";
import { CapsuleCorpHero } from "@/components/themed/CapsuleCorp/CapsuleCorpHero";
import { CapsuleCorpYesterdayCharacter } from "@/components/themed/CapsuleCorp/CapsuleCorpYesterdayCharacter";
import { CapsuleCorpWinBanner } from "@/components/themed/CapsuleCorp/CapsuleCorpWinBanner";
import { SilhouetteGameBoard } from "@/components/themed/SilhouetteGameBoard";
import {
  getDailySilhouetteCharacter,
  getYesterdaySilhouetteCharacter,
} from "@/service/daily";
import { getLocale, getTranslations } from "next-intl/server";
import { WinModal } from "@/components/shared/WinModal";

export default async function SilhouettePage() {
  const locale = await getLocale();
  const [t, dailyChar, yesterdayChar] = await Promise.all([
    getTranslations({ locale, namespace: "silhouette" }),
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

  return (
    <>
      <WinModal
        characterName={dailyChar.name}
        characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.thumb_path}`}
      />

      <MainContainer>
        <CapsuleCorpHero />
        {yesterdayChar && (
          <CapsuleCorpYesterdayCharacter
            characterName={yesterdayChar.name}
            characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${yesterdayChar.thumb_path}`}
          />
        )}
        <CapsuleCorpWinBanner
          todayCharacterSlug={dailyChar.slug}
          todayCharacterName={dailyChar.name}
          todayCharacterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.thumb_path}`}
          shareVariant="silhouette"
        />
        <SilhouetteGameBoard dailyCharacter={dailyChar} />
      </MainContainer>
    </>
  );
}
