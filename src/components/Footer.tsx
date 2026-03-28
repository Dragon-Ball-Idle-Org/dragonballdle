import { useTranslations } from "next-intl";
import Image from "next/image";
import { LinkIcon } from "@phosphor-icons/react/ssr";
import { IconLink } from "./_UI/Link";
import { SocialLinksModal } from "./SocialLinksModal";

export function Footer() {
  const t = useTranslations("footer");
  const tSocial = useTranslations("socialLinksModal");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-1 w-full text-center p-2 mb-24 md:mb-2">
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-shadow-[1px_1px_black]">
        <div>
          <span>{currentYear} DragonBallDle.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{t("copyright")}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <SocialLinksModal
          title={tSocial("title")}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <div className="flex items-center justify-center w-14 h-14 font-display text-2xl text-primary bg-black rounded-full border-2 border-primary">
            <LinkIcon />
          </div>
        </SocialLinksModal>
        <IconLink href="/legal">
          <div className="flex items-center justify-center w-14 h-14 font-display text-2xl text-zinc-900 bg-white rounded-full border-2 border-zinc-900">
            i
          </div>
        </IconLink>
        <IconLink
          href="https://buymeacoffee.com/dragonballdle"
          target="_blank"
          rel="noopener"
        >
          <Image
            src="/assets/buy-me-a-coffe.webp"
            width={64}
            height={64}
            alt="Buy me a coffe"
          />
        </IconLink>
      </div>
    </footer>
  );
}
