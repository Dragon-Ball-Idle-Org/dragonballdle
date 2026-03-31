import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsHero } from "@/components/themed/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/components/themed/MartialArtsYesterdayCharacter";
import { MartialArtsWinBanner } from "@/components/themed/MartialArtsWinBanner";
import { MartialArtsGuessForm } from "@/components/themed/MartialArtsGuessForm";
import { cn } from "@/utils/cn";
import GlassAccordion from "@/components/ui/GlassAccordion";
import {
  ArrowFatDownIcon,
  ArrowFatUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getDayIndex } from "@/lib/day";
import { ClassicGuessTableLoader } from "./ClassicGuessTable";
import { GuessesProvider } from "@/contexts/GuessesContext";
import { getDailyCharacter } from "@/service/daily";
import { getLocale } from "next-intl/server";

export default async function ClassicPage() {
  const dayIndex = getDayIndex();
  const locale = await getLocale();
  const daily = await getDailyCharacter(locale);

  if (!daily) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1>Daily character not found</h1>
      </div>
    );
  }

  return (
    <MainContainer>
      <GuessesProvider dayIndex={dayIndex} locale={locale}>
        <MartialArtsHero />
        <MartialArtsYesterdayCharacter />
        <MartialArtsWinBanner />
        <div
          className={cn(
            "flex flex-col items-center w-full max-w-200 p-4 relative z-1",
            "bg-black/17 backdrop-blur-xs rounded-xl shadow-[0_6px_24px_#00000026]",
            "[-webkit-overflow-scrolling:touch] [scrollbar-width:thin] snap-x snap-proximity overflow-x-auto",
          )}
        >
          <MartialArtsGuessForm />
          <ClassicGuessTableLoader daily={daily} />
        </div>

        <GlassAccordion
          className="w-full max-w-3xl"
          defaultOpenedValues={["tutorial"]}
          items={[
            {
              value: "tutorial",
              header: "Need a quick guide?",
              content: (
                <div className="p-3">
                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-green-600"></div>
                    <span>Correct - This attribute is exactly right.</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-amber-600"></div>
                    <span>Partial — At least one value matches.</span>
                  </div>

                  <div className="flex items-center gap-2 my-2 text-sm font-medium text-shadow-[0_2px_4px_rgba(0,0,0,.55),0_0_2px_rgba(0,0,0,.45)">
                    <div className="w-5 h-5 min-w-5 inline-grid place-items-center shrink-0 rounded-sm border border-white shadow-[inset_0_0_3px_#00000073] bg-red-600"></div>
                    <span>Incorrect — This attribute is completely wrong.</span>
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

                    <span>
                      After — The daily character’s debut saga is after your
                      guess.
                    </span>
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
                    <span>
                      Before — The daily character’s debut saga is before your
                      guess.
                    </span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </GuessesProvider>
    </MainContainer>
  );
}
