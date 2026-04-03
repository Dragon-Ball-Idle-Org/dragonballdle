import { getTranslations } from "next-intl/server";
import { WinModal } from "./WinModal";

interface WinModalWrapperProps {
  characterName: string;
  characterImage: string;
}

export async function WinModalWrapper({
  characterName,
  characterImage,
}: WinModalWrapperProps) {
  const t = await getTranslations("winModal");

  const translations = {
    congrats: t("congrats"),
    lineBefore: t("line.before"),
    lineAfter: t("line.after"),
    countdown: t("countdown"),
  };

  return (
    <WinModal
      characterName={characterName}
      characterImage={characterImage}
      translations={translations}
    />
  );
}
