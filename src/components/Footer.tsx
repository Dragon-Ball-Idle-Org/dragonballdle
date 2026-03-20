import { SOCIAL_LINKS_MAINTAINERS } from "@/src/shared/constants";
import Image from "next/image";
import { IconLink, TextLink } from "./_UI/Link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-1 w-full text-center p-2 mb-2 rounded-xl bg-black/60 backdrop-blur-sm">
      <div className="text-xl font-bold">DragonBallDle</div>
      <div className="text-sm">
        The daily challenge for true Dragon Ball fans
      </div>

      <div className="flex item-center justify-center gap-6">
        {SOCIAL_LINKS_MAINTAINERS.map((maintainer) => (
          <TextLink
            key={maintainer.title}
            href={maintainer.social_url}
            target="_blank"
            rel="noopener"
          >
            {maintainer.title}
          </TextLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
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

      <div className="flex flex-col items-center justify-center gap-2 text-sm text-zinc-400">
        <div>
          <span>{currentYear} DragonBallDle.</span>
        </div>
        <span>
          Dragon Ball is a registered trademark and property of Akira
          Toriyama/Shueisha, Toei Animation, who do not endorse or sponsor this
          game.
        </span>
      </div>
    </footer>
  );
}
