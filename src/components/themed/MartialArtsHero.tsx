import { cn } from "@/utils/cn";
import { WinsBadge } from "../shared/WinsBadge";

export function MartialArtsHero() {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 p-4 text-center",
        "w-full max-w-180 my-0 mx-auto p-4",
        "bg-primary bg-[url('/assets/dragon-background-texture.svg')] bg-no-repeat bg-bottom-right bg-cover shadow-hero",
        "border-martial-arts",
      )}
    >
      <h1 className="font-display text-hero-title text-shadow-hero-title">
        Guess Today&apos;s Dragon Ball Character!
      </h1>
      <span className="inline-flex items-baseline gap-2 font-bold text-hero-subtitle m-0 text-shadow-hero-subtitle">
        <WinsBadge count={20} className="self-center" />
        people have already guessed today&apos;s character!
      </span>
    </div>
  );
}
