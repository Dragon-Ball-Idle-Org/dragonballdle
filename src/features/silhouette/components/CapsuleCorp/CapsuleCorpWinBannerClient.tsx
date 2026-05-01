"use client";

import dynamic from "next/dynamic";

type CapsuleCorpWinBannerProps = {
  todayCharacterSlug: string;
  todayCharacterName: string;
  todayCharacterImage: string;
  shareVariant?: "classic" | "silhouette";
  playNextLabel?: string;
};

const CapsuleCorpWinBanner = dynamic(
  () =>
    import(
      "@/features/silhouette/components/CapsuleCorp/CapsuleCorpWinBanner"
    ).then((mod) => mod.CapsuleCorpWinBanner),
  { ssr: false },
);

export function CapsuleCorpWinBannerClient(props: CapsuleCorpWinBannerProps) {
  return <CapsuleCorpWinBanner {...props} />;
}
