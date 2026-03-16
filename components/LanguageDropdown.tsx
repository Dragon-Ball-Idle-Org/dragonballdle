"use client";

import { LANGUAGES } from "@/shared/constants";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import Image from "next/image";
import Link from "next/link";

export function LanguageDropdown() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          id="lang-fixed"
          className="w-9 h-9 rounded-full shadow-game"
          title="Change language"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="lang-menu"
        >
          <Image
            src="/assets/flags/en-us.svg"
            width={24}
            height={16}
            className="object-cover rounded-xs shadow-game"
            alt="Selected Lang"
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Languages"
        items={LANGUAGES.map((lang) => ({ lang }))}
      >
        {({ lang }) => (
          <DropdownItem key={lang}>
            <Link
              className="flex items-center gap-2 h-9 px-1 py-2 rounded-sm text-xs font-semibold hover:bg-white/80"
              role="menuitem"
              href={`/${lang}/`}
              data-lang={lang}
            >
              <Image
                src={`/assets/flags/${lang}.svg`}
                width={24}
                height={16}
                alt={lang.toUpperCase()}
                className="object-cover rounded-xs shadow-game"
                aria-hidden="true"
              />
              {lang.toUpperCase()}
            </Link>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
