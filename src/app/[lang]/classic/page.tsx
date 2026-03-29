import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsHero } from "@/components/themed/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/components/themed/MartialArtsYesterdayCharacter";
import { MartialArtsWinBanner } from "@/components/themed/MartialArtsWinBanner";
import { MartialArtsGuessForm } from "@/components/themed/MartialArtsGuessForm";
import { cn } from "@/utils/cn";
import { GuessesTable } from "@/components/shared/GuessesTable";
import { GuessStatus } from "@/domain/guess-status";

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
    </MainContainer>
  );
}
