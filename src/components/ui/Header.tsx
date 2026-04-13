import Image from "next/image";
import { LanguageDropdown } from "../desktop/LanguageDropdown";
import { BackButton } from "./BackButton";

const cdnURL = process.env.NEXT_PUBLIC_CDN_BASE_URL;

export function Header({
  hideBackButton = false,
}: {
  hideBackButton?: boolean;
}) {
  return (
    <header className="grid place-items-center mt-16">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          {!hideBackButton && <BackButton />}
        </div>

        <img
          id="logo"
          className="logo"
          src={`${cdnURL}/logo.png`}
          width={640}
          height={100}
          alt="DragonBallDle logo"
        />

        <div className="hidden md:block">
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}
