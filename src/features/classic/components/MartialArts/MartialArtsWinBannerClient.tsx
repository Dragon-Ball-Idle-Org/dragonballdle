"use client";

import dynamic from "next/dynamic";

type MartialArtsWinBannerProps = {
  todayCharacterSlug: string;
  todayCharacterName: string;
  todayCharacterImage: string;
};

const MartialArtsWinBanner = dynamic(
  () =>
    import(
      "@/features/classic/components/MartialArts/MartialArtsWinBanner"
    ).then((mod) => mod.MartialArtsWinBanner),
  { ssr: false },
);

export function MartialArtsWinBannerClient(props: MartialArtsWinBannerProps) {
  return <MartialArtsWinBanner {...props} />;
}
