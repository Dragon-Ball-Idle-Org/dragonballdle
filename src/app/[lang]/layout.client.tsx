"use client";

// import { AdCashBanner } from "@/components/ads/AdCashBanner";
// import { AdsTerraBanner } from "@/components/ads/AdsTerraBanner";
import { cn } from "@/utils/cn";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 justify-center w-full">
      <aside
        className={cn(
          "hidden xl:flex justify-center items-start w-40 shrink-0 pt-20",
        )}
      >
        {/* <AdsTerraBanner
          adKey="5fac8c4c89f7fa53f32520e88feda810"
          width={160}
          height={600}
          testId="adsterra-container-left"
        /> */}
      </aside>
      <div className="w-full max-w-285 px-3 flex flex-col flex-1">
        {children}
      </div>
      <aside
        className={cn(
          "hidden xl:flex justify-center items-start w-40 shrink-0 pt-20",
        )}
      >
        {/* <AdCashBanner zoneId="11259050" testId="adcash-container-right" /> */}
      </aside>
    </div>
  );
}
