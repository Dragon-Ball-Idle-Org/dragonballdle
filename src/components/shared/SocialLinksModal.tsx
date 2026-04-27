"use client";

import { PropsWithChildren, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  GlobeIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { CreatorRole, SOCIAL_LINKS_MAINTAINERS } from "@/shared/constants";

type SocialLinksModalProps = PropsWithChildren<{
  title: string;
  roles: Record<CreatorRole, string>;
  className?: string;
}>;

const IconMap = {
  linkedin: <LinkedinLogoIcon />,
  github: <GithubLogoIcon />,
  x: <XLogoIcon />,
  instagram: <InstagramLogoIcon />,
  portfolio: <GlobeIcon />,
};

export function SocialLinksModal({
  title,
  roles,
  children,
  className,
}: SocialLinksModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 pb-6">
          {SOCIAL_LINKS_MAINTAINERS.map((maintainer) => (
            <div
              key={maintainer.name}
              className="group relative flex flex-col items-center bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 transition-all duration-300 hover:border-orange-600/50 hover:bg-zinc-800/50 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]"
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-orange-600 to-orange-400 opacity-0 blur rounded-2xl transition duration-500 group-hover:opacity-20 translate-z-0" />

              <div className="relative flex flex-col items-center text-center">
                {maintainer.image ? (
                  <img
                    src={maintainer.image}
                    alt={maintainer.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-600 to-orange-400 flex items-center justify-center text-2xl font-display text-white mb-4 shadow-lg">
                    {maintainer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                <h3 className="text-xl font-display text-white mb-1">
                  {maintainer.name}
                </h3>

                <p className="text-sm font-medium text-zinc-400 mb-6 font-ui text-nowrap">
                  {roles[maintainer.role]}
                </p>

                <div className="grid grid-cols-5 md:grid-cols-3 content-center gap-4">
                  {maintainer.links.map((link) => (
                    <a
                      key={link.type}
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      title={
                        link.type.charAt(0).toUpperCase() + link.type.slice(1)
                      }
                      className="text-3xl text-zinc-400 transition-colors hover:text-orange-500 active:scale-90"
                    >
                      {IconMap[link.type as keyof typeof IconMap]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
