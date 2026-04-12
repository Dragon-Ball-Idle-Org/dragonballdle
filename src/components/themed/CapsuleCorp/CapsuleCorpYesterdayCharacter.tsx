import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { ShineGradientButton } from "../../ui/ShineGradientButton";

type CapsuleCorpYesterdayCharacterProps = {
  characterName: string;
  characterImage: string;
};

export function CapsuleCorpYesterdayCharacter({
  characterName,
  characterImage,
}: CapsuleCorpYesterdayCharacterProps) {
  const t = useTranslations("yesterday");

  return (
    <div
      className={cn(
        "grid justify-center gap-y-2 p-6 w-fit max-w-full mx-auto rounded-2xl",
        "background-capsule-corp-texture shadow-[0_4px_16px_rgba(2,6,23,0.5)]",
        "text-center text-shadow-[1px_1px_3px_#000000] text-white",
        "border-capsule-corp",
      )}
    >
      <h4 className="text-sm font-bold">{t("title")}</h4>
      <div className="flex flex-nowrap items-center justify-center gap-2">
        <img
          src={characterImage}
          alt={characterName}
          width={48}
          height={48}
          className="w-12 h-12 rounded-xl border border-white/20 object-cover bg-white shadow-[0_0_0_2px_#ffffff22,0_4px_12px_#0000004d]"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">{t("characterLabel")}</span>
          <ShineGradientButton
            className={cn(
              "font-ui font-bold text-[clamp(var(--text-sm),2.6vw,var(--text-md))] text-shadow-[0_1px_2px_rgba(0,0,0,.35)]",
              "py-1 px-2 rounded-full [box-shadow:inset_0_2px_10px_#0000002e,0_1px_10px_#10b98133]",
              "bg-linear-135 from-emerald-400 to-teal-600",
            )}
            shineColor="rgba(16, 185, 129, 0.4)"
          >
            {characterName}
          </ShineGradientButton>
        </div>
      </div>
    </div>
  );
}
