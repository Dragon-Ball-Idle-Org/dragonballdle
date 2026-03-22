"use client";

import { Link } from "@/i18n/navigation";
import { House, Info, Coffee } from "@phosphor-icons/react";
import { LanguageDropdown } from "./LanguageDropdown";

export function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t-2 border-orange-600 shadow-[0_-4px_20px_rgba(234,88,12,0.2)] z-50 pb-safe">
      <ul className="flex justify-around items-center h-16 px-2">
        <li>
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <House weight="fill" className="w-7 h-7" />
          </Link>
        </li>
        <li>
          <Link
            href="/legal"
            className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <Info weight="fill" className="w-7 h-7" />
          </Link>
        </li>
        <li>
          <a
            href="https://buymeacoffee.com/dragonballdle"
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <Coffee weight="fill" className="w-7 h-7" />
          </a>
        </li>
        <li>
          <div className="flex flex-col items-center justify-center">
            <LanguageDropdown placement="top" />
          </div>
        </li>
      </ul>
    </nav>
  );
}
