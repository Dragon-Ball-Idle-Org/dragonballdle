"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { getWithExpiry } from "@/utils/storage";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

interface DesktopNavigationProps {
  classicLabel: string;
  silhouetteLabel: string;
}

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
    <nav className="relative hidden md:flex items-center justify-center mt-2">
      {/* Background track line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-1.5 bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
      
      <div className="flex items-center justify-center gap-16 relative z-10">
        {routes.map((route) => {
          const isWon = wonModes[route.id];
          const isActive = pathname.startsWith(route.href);
          
          return (
            <Link
              key={route.href}
              href={route.href as any}
              className={cn(
                "relative min-w-[200px] px-6 py-2.5 flex items-center justify-center gap-3 rounded-2xl font-display tracking-widest text-2xl transition-all cursor-pointer hover:scale-110",
                isActive
                  ? "bg-orange-600 text-white border-2 border-orange-600 shadow-lg shadow-orange-600/50"
                  : isWon
                    ? "bg-zinc-900 border-2 border-green-500 text-zinc-300 hover:border-green-400 hover:text-white"
                    : "bg-black/90 border-2 border-zinc-600 text-zinc-400 hover:border-orange-600 hover:text-white"
              )}
            >
              {route.label}
              
              {isWon && (
                <CheckCircleIcon 
                  weight="fill" 
                  className={cn("text-2xl", isActive ? "text-white" : "text-green-500")} 
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

