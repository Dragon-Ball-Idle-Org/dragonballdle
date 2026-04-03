import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type GameButtonProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  href: string;
};

export function GameButton({ icon, title, subtitle, href }: GameButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 sm:gap-10 w-full sm:w-auto sm:min-w-130 p-3",
        "background-dragon-texture",
        "cursor-pointer transition-all hover:scale-105 sm:hover:scale-110",
        "relative before:absolute before:content-[''] before:inset-0 before:border-24 before:border-transparent before:pointer-events-none before:[border-image:url('/assets/dragon-border.svg')_500_stretch] before:z-1",
      )}
    >
      <div className="px-2 sm:px-5">{icon}</div>
      <div className="flex flex-col items-start">
        <h3 className="text-3xl sm:text-5xl font-display">{title}</h3>
        <span className="text-sm sm:text-base">{subtitle}</span>
      </div>
    </Link>
  );
}

type GameButtonDisabledProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export function GameButtonDisabled({
  icon,
  title,
  subtitle,
}: GameButtonDisabledProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 sm:gap-10 w-full sm:w-auto sm:min-w-130 p-3",
        "background-dragon-texture-gray",
        "cursor-pointer transition-all hover:scale-105 sm:hover:scale-110",
        "relative before:absolute before:content-[''] before:inset-0 before:border-24 before:border-transparent before:pointer-events-none before:[border-image:url('/assets/dragon-border-gray.svg')_500_stretch] before:z-1",
      )}
    >
      <div className="px-2 sm:px-5">{icon}</div>
      <div className="flex flex-col items-start">
        <h3 className="text-3xl sm:text-5xl font-display">{title}</h3>
        <span className="text-sm sm:text-base">{subtitle}</span>
      </div>
    </div>
  );
}
