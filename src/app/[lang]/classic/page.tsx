import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsHero } from "@/components/themed/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/components/themed/MartialArtsYesterdayCharacter";
import { MartialArtsWinBanner } from "@/components/themed/MartialArtsWinBanner";
import { MartialArtsGuessForm } from "@/components/themed/MartialArtsGuessForm";
import { cn } from "@/utils/cn";
import { GuessesTable } from "@/components/shared/GuessesTable";
import { GuessStatus } from "@/domain/guess-status";
import GlassAccordion from "@/components/ui/GlassAccordion";
import {
  ArrowFatDownIcon,
  ArrowFatUpIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function ClassicPage() {
  return (
    <MainContainer>
      <MartialArtsHero />
      <MartialArtsYesterdayCharacter />
      <MartialArtsWinBanner />
      <div
        className={cn(
          "flex flex-col items-center w-full max-w-200 p-4 rounded-xl",
          "bg-black/17 backdrop-blur-xs shadow-[0_6px_24px_#00000026]",
          "relative z-1 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] snap-x snap-proximity",
        )}
      >
        <MartialArtsGuessForm />
        <GuessesTable
          headers={["character", "name", "gender", "series", "saga"]}
          guesses={[
            {
              character: {
                imgSrc:
                  "https://cdn.dragonballdle.site/characters/thumbs/android_15.png",
                alt: "Android 15",
              },
              name: { value: "Android 15", status: GuessStatus.CORRECT },
              gender: { value: "Female", status: GuessStatus.WRONG },
              series: { value: "Dragon Ball Z", status: GuessStatus.PARTIAL },
              saga: { value: "Dragon Ball Z", status: GuessStatus.OLDEST },
            },
            {
              character: {
                imgSrc:
                  "https://cdn.dragonballdle.site/characters/thumbs/android_16.png",
                alt: "Android 16",
              },
              name: { value: "Android 15", status: GuessStatus.CORRECT },
              gender: { value: "Female", status: GuessStatus.WRONG },
              series: { value: "Dragon Ball Z", status: GuessStatus.PARTIAL },
              saga: { value: "Dragon Ball Z", status: GuessStatus.NEWEST },
            },
          ]}
        />
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
                      <ArrowFatUpIcon weight="fill" className="w-full h-full" />
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
    </MainContainer>
  );
}
