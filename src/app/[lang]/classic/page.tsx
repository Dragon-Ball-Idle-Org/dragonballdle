import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsHero } from "@/features/classic/components/MartialArts/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/features/classic/components/MartialArts/MartialArtsYesterdayCharacter";
import { MartialArtsWinBanner } from "@/features/classic/components/MartialArts/MartialArtsWinBanner";
import { ClassicGameBoard } from "@/features/classic/components/ClassicGameBoard";
import { cn } from "@/utils/cn";
import GlassAccordion from "@/components/ui/GlassAccordion";
import {
  ArrowFatDownIcon,
  ArrowFatUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ClassicGuessTableLoader } from "./ClassicGuessTable";
import {
  getDailyCharacter,
  getYesterdayCharacter,
} from "@/features/game-engine/services/daily";
import { getLocale, getTranslations } from "next-intl/server";
import { WinModal } from "@/components/shared/WinModal";

export const revalidate = 3600;

export default async function ClassicPage() {
  const locale = await getLocale();
  const [t, tHome, dailyChar, yesterdayChar] = await Promise.all([
    getTranslations({ locale, namespace: "classic" }),
    getTranslations({ locale, namespace: "home" }),
    getDailyCharacter(locale),
    getYesterdayCharacter(locale),
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
        characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.image_path}`}
        playNextLabel={`${tHome("silhouette.title")}!`}
      />

      <MainContainer>
        <MartialArtsHero />
        {yesterdayChar && (
          <MartialArtsYesterdayCharacter
            characterName={yesterdayChar.name}
            characterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${yesterdayChar.thumb_path}`}
          />
        )}
        <MartialArtsWinBanner
          todayCharacterSlug={dailyChar.slug}
          todayCharacterName={dailyChar.name}
          todayCharacterImage={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${dailyChar.thumb_path}`}
        />
        <div
          className={cn(
            "flex flex-col items-center w-full max-w-200 p-4 relative z-1",
            "bg-black/17 backdrop-blur-xs rounded-xl shadow-[0_6px_24px_#00000026]",
            "[-webkit-overflow-scrolling:touch] [scrollbar-width:thin] snap-x snap-proximity overflow-x-auto",
          )}
        >
          <ClassicGameBoard dailyCharacter={dailyChar} />
          <ClassicGuessTableLoader dailyCharacter={dailyChar} />
        </div>

        <GlassAccordion
          className="w-full max-w-3xl"
          defaultOpenedValues={["tutorial"]}
          items={[
            {
              value: "tutorial",
              header: t("guide.header"),
              content: (
                <div className="p-3">
                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-green-600"></div>
                    <span>{t("guide.correct")}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-amber-600"></div>
                    <span>{t("guide.partial")}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-red-600"></div>
                    <span>{t("guide.incorrect")}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="relative w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-red-600">
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <img
                          src="/assets/tira_cinema.svg"
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </span>
                    </div>
                    <span>{t("guide.movieMismatch")}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="relative w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-red-600">
                      <span className="absolute inset-0 flex items-center justify-center text-black pointer-events-none select-none">
                        <ArrowFatUpIcon
                          weight="fill"
                          className="w-full h-full"
                        />
                      </span>
                    </div>

                    <span>{t("guide.after")}</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="relative w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-red-600">
                      <span className="absolute inset-0 flex items-center justify-center text-black pointer-events-none select-none">
                        <ArrowFatDownIcon
                          weight="fill"
                          className="w-full h-full"
                        />
                      </span>
                    </div>
                    <span>{t("guide.before")}</span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </MainContainer>
    </>
  );
}
