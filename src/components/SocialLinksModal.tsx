"use client";

import { PropsWithChildren, useState } from "react";
import { Modal } from "@/components/_UI/Modal";
import { LinkedinLogoIcon } from "@phosphor-icons/react";
import { SOCIAL_LINKS_MAINTAINERS } from "@/shared/constants";
import { TextLink } from "./_UI/Link";

type SocialLinksModalProps = PropsWithChildren<{
  title: string;
  className?: string;
}>;

export function SocialLinksModal({
  title,
  children,
  className,
}: SocialLinksModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <div className="flex item-center justify-center gap-6">
          {SOCIAL_LINKS_MAINTAINERS.map((maintainer) => (
            <TextLink
              key={maintainer.title}
              href={maintainer.social_url}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 text-nowrap transition-colors hover:text-primary"
            >
              <LinkedinLogoIcon weight="fill" className="w-7 h-7" />
              {maintainer.title}
            </TextLink>
          ))}
        </div>
      </Modal>
    </>
  );
}
