"use client";

import { AdCashBanner } from "@/components/ads/AdCashBanner";
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
          "border-r border-white/10",
        )}
      >
        <AdCashBanner zoneId="11261446" />
      </aside>
      <div className="w-full max-w-285 px-3 flex flex-col flex-1">
        {children}
      </div>
      <aside
        className={cn(
          "hidden xl:flex justify-center items-start w-40 shrink-0 pt-20",
          "border-l border-white/10",
        )}
      >
        <AdCashBanner zoneId="11261446" />
      </aside>
    </div>
  );
}
