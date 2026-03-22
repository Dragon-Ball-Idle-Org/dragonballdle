"use client";

import { Link } from "@/i18n/navigation";
import { HouseIcon, InfoIcon, CoffeeIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BottomNavBar() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentLanguage = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChangeLanguage = (lang: string) => {
    router.push(pathname, { locale: lang });
    setIsLangOpen(false);
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t-2 border-orange-600 shadow-[0_-4px_20px_rgba(234,88,12,0.2)] z-40 pb-safe">
        <ul className="flex justify-around items-center h-16 px-2">
          <li>
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
            >
              <HouseIcon weight="fill" className="w-7 h-7" />
            </Link>
          </li>
          <li>
            <Link
              href="/legal"
              className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
            >
              <InfoIcon weight="fill" className="w-7 h-7" />
            </Link>
          </li>
          <li>
            <a
              href="https://buymeacoffee.com/dragonballdle"
              target="_blank"
              rel="noopener"
              className="flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 transition-colors"
            >
              <CoffeeIcon weight="fill" className="w-7 h-7" />
            </a>
          </li>
          <li>
            <button
              onClick={() => setIsLangOpen(true)}
              title="Change language"
              className="cursor-pointer"
            >
              <Image
                src={`/assets/flags/${currentLanguage.toLowerCase()}.svg`}
                width={24}
                height={16}
                className="h-4 object-cover rounded-xs"
                alt="Selected Lang"
              />
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {isLangOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsLangOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative w-64 h-full bg-zinc-950 border-l-2 border-orange-600 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <span className="font-display text-xl text-white tracking-widest uppercase">
                  Language
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
                {routing.locales.map((lang) => (
                  <button
                    key={lang}
                    data-lang={lang}
                    onClick={() => onChangeLanguage(lang)}
                    className={`flex items-center gap-3 p-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors ${
                      lang === currentLanguage
                        ? "bg-orange-600/20 text-orange-500 border border-orange-600/50"
                        : "text-white hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <Image
                      src={`/assets/flags/${lang.toLowerCase()}.svg`}
                      width={32}
                      height={24}
                      alt={lang.toUpperCase()}
                      className="h-5 w-8 object-cover rounded-sm shadow-sm"
                    />
                    <span>{lang.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
