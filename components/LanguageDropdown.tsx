"use client";

import { LANGUAGES } from "@/shared/constants";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="lang-fixed"
        className="w-9 h-9 rounded-full shadow-game"
        title="Change language"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="lang-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Image
          src="/assets/flags/en-us.svg"
          width={24}
          height={16}
          className="object-cover rounded-xs shadow-game"
          alt="Selected Lang"
        />
      </button>

      {open && (
        <div
          id="lang-menu"
          role="menu"
          aria-label="Select language"
          className="absolute right-0 mt-2 w-32 max-h-64 overflow-y-auto rounded-md shadow-game bg-white z-50"
        >
          {LANGUAGES.map((lang) => (
            <Link
              key={lang}
              role="menuitem"
              href={`/${lang}/`}
              data-lang={lang}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-orange-100 transition-colors"
            >
              <Image
                src={`/assets/flags/${lang}.svg`}
                width={24}
                height={16}
                alt={lang.toUpperCase()}
                className="object-cover rounded-xs"
                aria-hidden="true"
              />
              {lang.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
