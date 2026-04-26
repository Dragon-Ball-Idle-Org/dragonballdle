import { getTranslations } from "next-intl/server";
import { LinkIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { IconLink } from "../ui/Link";
import { SocialLinksModal } from "../shared/SocialLinksModal";
import { ChangelogButton } from "../shared/ChangelogButton";

export async function Footer() {
  const t = await getTranslations("footer");
  const tSocial = await getTranslations("socialLinksModal");
  const tCommon = await getTranslations("common");
  const tChangelog = await getTranslations("changelog");
  const currentYear = new Date().getFullYear();

  const roles = {
    frontend: tCommon("roles.frontend"),
    analytics: tCommon("roles.analytics"),
    fullstack: tCommon("roles.fullstack"),
  };

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
          roles={roles}
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
        <ChangelogButton
          title={tChangelog("title")}
          latestVersion={tChangelog("latestVersion")}
        />
        <IconLink
          href="https://buymeacoffee.com/dragonballdle"
          target="_blank"
          rel="noopener"
        >
          <img
            src="/assets/buy-me-a-coffe.webp"
            width={64}
            height={64}
            alt="Buy me a coffee"
          />
        </IconLink>
        <IconLink
          href="/contact-us"
          className="flex items-center justify-center w-14 h-14 font-display text-2xl text-primary bg-black rounded-full border-2 border-primary cursor-pointer transition-transform hover:scale-110"
        >
          <PhoneIcon weight="fill" />
        </IconLink>
      </div>
    </footer>
  );
}
