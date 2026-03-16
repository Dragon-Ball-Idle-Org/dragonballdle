import Image from "next/image";
import { LanguageDropdown } from "./LanguageDropdown";

const cdnURL = process.env.NEXT_PUBLIC_CDN_BASE_URL;

export function Header() {
  return (
    <header className="grid place-items-center mt-16">
      <Image
        id="logo"
        className="logo"
        width={640}
        height={100}
        src={`${cdnURL}/logo.png`}
        alt="DragonBallDle logo"
      />

      <LanguageDropdown />
    </header>
  );
}
