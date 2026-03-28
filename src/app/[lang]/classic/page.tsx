import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsHero } from "@/components/themed/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/components/themed/MartialArtsYesterdayCharacter";
import { MartialArtsWinBanner } from "@/components/themed/MartialArtsWinBanner";
import { MartialArtsGuessForm } from "@/components/themed/MartialArtsGuessForm";
import { cn } from "@/utils/cn";

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
      </div>
    </MainContainer>
  );
}
