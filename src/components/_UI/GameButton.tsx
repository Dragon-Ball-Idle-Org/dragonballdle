import { Link } from "@/i18n/navigation";
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
      className="flex items-center gap-10 min-w-130 p-3 bg-primary border-2 border-orange-600 rounded-2xl cursor-pointer transition-all hover:scale-110"
    >
      <div className="px-5">{icon}</div>
      <div className="flex flex-col items-start">
        <h3 className="text-5xl font-display">{title}</h3>
        <span>{subtitle}</span>
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
    <div className="flex items-center gap-10 min-w-130 p-3 bg-zinc-300 border-2 border-zinc-600 rounded-2xl cursor-pointer transition-all hover:scale-110">
      <div className="px-5">{icon}</div>
      <div className="flex flex-col items-start">
        <h3 className="text-5xl font-display">{title}</h3>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
