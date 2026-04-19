"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

interface DesktopNavigationProps {
  classicLabel: string;
  silhouetteLabel: string;
}

export function DesktopNavigation({ classicLabel, silhouetteLabel }: DesktopNavigationProps) {
  const pathname = usePathname();

  const routes = [
    { href: "/classic", label: classicLabel },
    { href: "/silhouette", label: silhouetteLabel },
  ];

  return (
    <nav className="hidden md:flex items-center justify-center gap-6">
      {routes.map(({ href, label }) => {
        // Exclude exact matches for root path if there's any, but here we just check prefix
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href as any}
            className={cn(
              "px-8 py-2.5 flex items-center justify-center rounded-2xl font-display tracking-widest text-2xl transition-all cursor-pointer hover:scale-110",
              isActive
                ? "bg-orange-600 text-white border-2 border-orange-600 shadow-lg shadow-orange-600/50"
                : "bg-black/80 text-zinc-300 border-2 border-zinc-600 hover:border-orange-600 hover:text-white"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
