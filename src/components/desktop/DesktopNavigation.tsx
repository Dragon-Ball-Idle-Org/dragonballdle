"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { getWithExpiry } from "@/utils/storage";
import { StarIcon } from "@phosphor-icons/react/dist/ssr";

interface DesktopNavigationProps {
  classicLabel: string;
  silhouetteLabel: string;
}

const ThematicNode = ({ isWon, isActive }: { isWon: boolean; isActive: boolean }) => {
  if (isWon) {
    return (
      <div className="relative w-8 h-8 shrink-0 rounded-full bg-linear-to-br from-orange-300 via-orange-500 to-red-600 border border-orange-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(249,115,22,0.8)] flex items-center justify-center overflow-hidden">
        <StarIcon weight="fill" className="text-red-700 w-4 h-4 z-10" />
        <div className="absolute top-1 left-2 w-2 h-1 bg-white/70 rounded-full -rotate-45" />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="relative w-8 h-8 shrink-0 rounded-full bg-zinc-900 border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 border border-green-500/30 rounded-full scale-150" />
        <div className="absolute w-full h-px bg-green-500/30" />
        <div className="absolute h-full w-px bg-green-500/30" />
        <div className="absolute w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full z-10" />
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 shrink-0 rounded-full bg-linear-to-br from-zinc-400 via-zinc-500 to-zinc-700 border border-zinc-800 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
      <StarIcon weight="fill" className="text-zinc-800/40 w-4 h-4" />
      <div className="absolute top-1 left-2 w-2 h-1 bg-white/20 rounded-full -rotate-45" />
    </div>
  );
};

export function DesktopNavigation({ classicLabel, silhouetteLabel }: DesktopNavigationProps) {
  const pathname = usePathname();
  const [wonModes, setWonModes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkStatus = () => {
      const classicWon = getWithExpiry("dragonballdle:game-won:classic") === true;
      const silhouetteWon = getWithExpiry("dragonballdle:game-won:silhouette") === true;
      setWonModes({
        classic: classicWon,
        silhouette: silhouetteWon
      });
    };

    checkStatus();

    window.addEventListener("game-won-changed", checkStatus);
    return () => window.removeEventListener("game-won-changed", checkStatus);
  }, [pathname]);

  const routes = [
    { id: "classic", href: "/classic", label: classicLabel },
    { id: "silhouette", href: "/silhouette", label: silhouetteLabel },
  ];

  return (
    <nav className="relative hidden md:flex items-center justify-center mt-2 px-8">
      <div className="absolute top-1/2 left-[15%] right-[15%] h-0 border-t-4 border-dashed border-zinc-700/60 -translate-y-1/2 z-0" />

      <div className="flex items-center justify-center gap-20 relative z-10">
        {routes.map((route) => {
          const isWon = wonModes[route.id];
          const isActive = pathname.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href as "/classic" | "/silhouette"}
              className={cn(
                "relative min-w-[200px] px-6 py-2 flex items-center gap-3 rounded-full font-display tracking-widest text-2xl transition-all cursor-pointer group",
                isActive
                  ? isWon
                    ? "bg-orange-950/80 text-orange-50 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    : "bg-black/90 text-green-50 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : isWon
                    ? "bg-black/90 border-2 border-orange-500/40 text-orange-200 hover:border-orange-500"
                    : "bg-black/80 border-2 border-zinc-700 text-zinc-400 hover:border-green-500/50 hover:text-zinc-200"
              )}
            >
              <ThematicNode isWon={isWon} isActive={isActive} />

              <span className="group-hover:scale-105 transition-transform origin-left">
                {route.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

