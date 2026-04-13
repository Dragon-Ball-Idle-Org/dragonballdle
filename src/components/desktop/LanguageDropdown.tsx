"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface LanguageDropdownProps {
  placement?: "top" | "bottom";
}

export function LanguageDropdown({ placement = "bottom" }: LanguageDropdownProps = {}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLanguage = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onChangeLanguage = (lang: string) => {
    router.push(pathname, { locale: lang });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        id="lang-fixed"
        className="w-10 h-10 rounded-full shadow-game flex items-center justify-center cursor-pointer bg-black transition-transform hover:scale-110"
        title="Change language"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="lang-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={`/assets/flags/${currentLanguage.toLowerCase()}.svg`}
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
          className={`absolute grid gap-1 p-2 right-0 w-38 max-h-50 overflow-y-auto rounded-xl shadow-game bg-black z-50 ${
            placement === "bottom" ? "mt-2" : "bottom-full mb-2"
          }`}
        >
          {routing.locales.map((lang) => (
            <button
              key={lang}
              role="menuitem"
              data-lang={lang}
              onClick={() => onChangeLanguage(lang)}
              className="flex items-center gap-2 h-9 px-2 py-1 rounded-md text-xs font-semibold text-white hover:bg-white/20"
            >
              <img
                src={`/assets/flags/${lang.toLowerCase()}.svg`}
                width={24}
                height={16}
                alt={lang.toUpperCase()}
                className="h-4 object-cover rounded-xs"
                aria-hidden="true"
              />
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
