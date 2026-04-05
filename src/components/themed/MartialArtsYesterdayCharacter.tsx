import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Image from "next/image";

type MartialArtsYesterdayCharacterProps = {
  characterName: string;
  characterImage: string;
};

export function MartialArtsYesterdayCharacter({
  characterName,
  characterImage,
}: MartialArtsYesterdayCharacterProps) {
  const t = useTranslations("yesterday");

  return (
    <div
      className={cn(
        "grid justify-center gap-y-2 p-6 w-fit max-w-full mx-auto",
        "bg-primary shadow-[0_4px_12px_#00000040]",
        "text-center text-shadow-[1px_1px_3px_#000000]",
        "border-martial-arts",
      )}
    >
      <h4 className="text-sm font-bold">{t("title")}</h4>
      <div className="flex flex-nowrap items-center justify-center gap-2">
        <img
          src={characterImage}
          alt={characterName}
          width={48}
          height={48}
          className="w-12 h-12 rounded-xl border object-cover bg-white shadow-[0_0_0_2px_#fff9,0_4px_12px_#0000004d]"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">
            {t("characterLabel")}
          </span>
          <span
            className={cn(
              "font-ui font-bold text-[clamp(var(--text-sm),2.6vw,var(--text-md))] text-shadow-[0_1px_2px_rgba(0,0,0,.35)]",
              "py-1 px-2 rounded-full [box-shadow:inset 0 2px 10px #0000002e,0 1px 10px #0000001f]",
              "bg-linear-135 from-green-500 to-green-700",
            )}
          >
            {characterName}
          </span>
        </div>
      </div>
    </div>
  );
}
