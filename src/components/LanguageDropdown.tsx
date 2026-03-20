"use client";

import { LANGUAGES } from "@/src/shared/constants";
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
        className="w-9 h-9 rounded-full shadow-game flex items-center justify-center cursor-pointer bg-black"
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
          className="h-4 object-cover rounded-xs"
          alt="Selected Lang"
        />
      </button>

      {open && (
        <div
          id="lang-menu"
          role="menu"
          aria-label="Select language"
          className="absolute grid gap-1 p-2 right-0 mt-2 w-38 max-h-50 overflow-y-auto rounded-xl shadow-game bg-black z-50"
        >
          {LANGUAGES.map((lang) => (
            <Link
              key={lang}
              role="menuitem"
              href={`/${lang}/`}
              data-lang={lang}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 h-9 px-2 py-1 rounded-md text-xs font-semibold text-white hover:bg-white/20"
            >
              <Image
                src={`/assets/flags/${lang}.svg`}
                width={24}
                height={16}
                alt={lang.toUpperCase()}
                className="h-4 object-cover rounded-xs"
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
