import Image from "next/image";
import { LanguageDropdown } from "./LanguageDropdown";
import { BackButton } from "./_UI/BackButton";

const cdnURL = process.env.NEXT_PUBLIC_CDN_BASE_URL;

export function Header() {
  return (
    <header className="grid place-items-center mt-16">
      <div className="flex items-center gap-4">
        <BackButton />

        <Image
          id="logo"
          className="logo"
          src={`${cdnURL}/logo.png`}
          priority
          width={640}
          height={100}
          alt="DragonBallDle logo"
        />

        <LanguageDropdown />
      </div>
    </header>
  );
}
