import { LanguageDropdown } from "../desktop/LanguageDropdown";
import { BackButton } from "./BackButton";
import { getTranslations } from "next-intl/server";
import { DesktopNavigation } from "../desktop/DesktopNavigation";
import Image from "next/image";

const cdnURL = process.env.NEXT_PUBLIC_CDN_BASE_URL;

export async function Header({
  hideBackButton = false,
  hideNavigation = false,
}: {
  hideBackButton?: boolean;
  hideNavigation?: boolean;
}) {
  const t = await getTranslations("home");

  return (
    <header className="flex flex-col items-center gap-6 mt-16 w-full">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          {!hideBackButton && <BackButton />}
        </div>

        <Image
          id="logo"
          className="w-full h-auto"
          src={`${cdnURL}/logo.png`}
          width={640}
          height={100}
          alt="DragonBallDle logo"
          priority
        />

        <div className="hidden md:block">
          <LanguageDropdown />
        </div>
      </div>

      {!hideNavigation && (
        <DesktopNavigation
          classicLabel={t("classic.title")}
          silhouetteLabel={t("silhouette.title")}
        />
      )}
    </header>
  );
}
