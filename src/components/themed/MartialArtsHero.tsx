import { cn } from "@/utils/cn";
import { WinsBadge } from "../shared/WinsBadge";
import { getWinsCount } from "@/service/wins";
import { getLocale, getTranslations } from "next-intl/server";

export async function MartialArtsHero() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "hero" });
  const count = await getWinsCount();

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
        {t("title")}
      </h1>
      <span className="inline-flex items-baseline gap-2 font-bold text-hero-subtitle m-0 text-shadow-hero-subtitle">
        <WinsBadge count={count} className="self-center" />
        {t("subtitle")}
      </span>
    </div>
  );
}
