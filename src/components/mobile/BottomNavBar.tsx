"use client";

import { Link } from "@/i18n/navigation";
import { InfoIcon, HouseIcon, StarIcon, LinkIcon, CoffeeIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SocialLinksModal } from "../shared/SocialLinksModal";
import { CreatorRole } from "@/shared/constants";
import { getWithExpiry } from "@/utils/storage";
import { cn } from "@/utils/cn";

type BottomNavBarProps = {
  socialLinksTitle: string;
  roles: Record<CreatorRole, string>;
  languagesDrawerTitle: string;
  changeLanguageButtonTitle: string;
  classicTitle: string;
  silhouetteTitle: string;
};

const MobileThematicNode = ({ isWon, isActive }: { isWon: boolean; isActive: boolean }) => {
  if (isWon) {
    return (
      <div className="relative w-12 h-12 shrink-0 rounded-full bg-linear-to-br from-orange-300 via-orange-500 to-red-600 border border-orange-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(249,115,22,0.8)] flex items-center justify-center overflow-hidden">
        <StarIcon weight="fill" className="text-red-700 w-6 h-6 z-10" />
        <div className="absolute top-1.5 left-2 w-3 h-2.5 bg-white/40 rounded-full blur-[1px]" />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="relative w-12 h-12 shrink-0 rounded-full bg-zinc-900 border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 border border-green-500/30 rounded-full scale-150" />
        <div className="absolute w-[150%] h-px bg-green-500/30 rotate-45" />
        <div className="absolute w-[150%] h-px bg-green-500/30 -rotate-45" />
        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
        <div className="absolute w-2.5 h-2.5 bg-green-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 shrink-0 rounded-full bg-linear-to-br from-zinc-400 via-zinc-500 to-zinc-700 border border-zinc-800 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
      <StarIcon weight="fill" className="text-zinc-800/40 w-6 h-6" />
    </div>
  );
};

export function BottomNavBar({
  socialLinksTitle,
  roles,
  languagesDrawerTitle,
  changeLanguageButtonTitle,
  classicTitle,
  silhouetteTitle,
}: BottomNavBarProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const currentLanguage = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [wonModes, setWonModes] = useState<Record<string, boolean>>({
    classic: false,
    silhouette: false,
  });

  useEffect(() => {
    const checkWonStatus = () => {
      setWonModes({
        classic: getWithExpiry("dragonballdle:game-won:classic") === true,
        silhouette: getWithExpiry("dragonballdle:game-won:silhouette") === true,
      });
    };

    checkWonStatus();
    window.addEventListener("game-won-changed", checkWonStatus);
    return () => window.removeEventListener("game-won-changed", checkWonStatus);
  }, []);

  const onChangeLanguage = (lang: string) => {
    router.push(pathname, { locale: lang });
    setIsLangOpen(false);
  };

  const isClassicActive = pathname.startsWith("/classic");
  const isSilhouetteActive = pathname.startsWith("/silhouette");

  return (
    <>
      <AnimatePresence>
        {isFabOpen && (
          <div className="md:hidden fixed inset-0 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer pointer-events-auto"
              onClick={() => setIsFabOpen(false)}
            />

            <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 flex justify-center items-end" style={{ width: 0, height: 0 }}>
              <motion.div
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x: -100, y: -30, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8, delay: 0.05 }}
                className="absolute pointer-events-auto flex items-center justify-center flex-col"
              >
                <Link href="/classic" className="flex flex-col items-center gap-2 group" onClick={() => setIsFabOpen(false)}>
                  <div className={cn("rounded-full p-1.5 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)]", isClassicActive ? "border-2 border-orange-500 bg-black/60 scale-110" : "border-2 border-transparent scale-100 bg-black/40")}>
                    <MobileThematicNode isWon={wonModes.classic} isActive={isClassicActive} />
                  </div>
                  <span className="text-xs bg-black/80 font-bold uppercase tracking-wider text-orange-400 px-3 py-1 rounded-full text-nowrap border border-orange-950/50 shadow-md">
                    {classicTitle}
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x: 0, y: -110, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8, delay: 0.1 }}
                className="absolute pointer-events-auto flex items-center justify-center flex-col"
              >
                <Link href="/" className="flex flex-col items-center gap-2 group" onClick={() => setIsFabOpen(false)}>
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-900 border-2 border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                    <HouseIcon weight="fill" className="text-orange-500 w-7 h-7" />
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x: 100, y: -30, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
                className="absolute pointer-events-auto flex items-center justify-center flex-col"
              >
                <Link href="/silhouette" className="flex flex-col items-center gap-2 group" onClick={() => setIsFabOpen(false)}>
                  <div className={cn("rounded-full p-1.5 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)]", isSilhouetteActive ? "border-2 border-orange-500 bg-black/60 scale-110" : "border-2 border-transparent scale-100 bg-black/40")}>
                    <MobileThematicNode isWon={wonModes.silhouette} isActive={isSilhouetteActive} />
                  </div>
                  <span className="text-xs bg-black/80 font-bold uppercase tracking-wider text-orange-400 px-3 py-1 rounded-full text-nowrap border border-orange-950/50 shadow-md">
                    {silhouetteTitle}
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-t border-orange-800/40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40 pb-safe">
        <ul className="flex justify-around items-center h-[72px] px-2 relative z-10 w-full">

          <li className="flex-1 flex justify-center">
            <SocialLinksModal
              title={socialLinksTitle}
              roles={roles}
              className="flex items-center justify-center text-zinc-400 hover:text-orange-400 transition-transform hover:scale-110 active:scale-95 active:duration-75 cursor-pointer outline-none"
            >
              <LinkIcon weight="fill" size={28} />
            </SocialLinksModal>
          </li>

          <li className="flex-1 flex justify-center">
            <Link
              href="/legal"
              className="flex items-center justify-center text-zinc-400 hover:text-orange-400 transition-transform hover:scale-110 active:scale-95 active:duration-75 outline-none"
            >
              <InfoIcon weight="fill" size={28} />
            </Link>
          </li>

          <li className="flex-none px-2 relative -top-6">
            <button
              onClick={() => setIsFabOpen((prev) => !prev)}
              className="flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 active:duration-75 z-50 outline-none group"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <motion.div
                className={cn(
                  "rounded-full p-1.5 flex items-center justify-center transition-all relative overflow-hidden",
                  isFabOpen ? "border-2 border-green-500 bg-zinc-950 shadow-[0_0_25px_rgba(34,197,94,0.6)]" : "border-2 border-orange-600 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                )}
                animate={{ scale: isFabOpen ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {isFabOpen && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_70%,rgba(34,197,94,0.6)_100%)] z-0"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <div className="absolute inset-0 bg-green-500/10 animate-pulse z-0" />
                  </>
                )}

                <img
                  src="/assets/dragon-radar.svg"
                  alt="Game Navigation"
                  width={60}
                  height={60}
                  className="w-14 h-14 relative z-10"
                />
              </motion.div>
            </button>
          </li>

          <li className="flex-1 flex justify-center">
            <a
              href="https://buymeacoffee.com/dragonballdle"
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center text-zinc-400 hover:text-orange-400 transition-transform hover:scale-110 active:scale-95 active:duration-75 outline-none"
            >
              <CoffeeIcon weight="fill" size={28} />
            </a>
          </li>

          <li className="flex-1 flex justify-center">
            <button
              onClick={() => setIsLangOpen(true)}
              title={changeLanguageButtonTitle}
              className="flex items-center justify-center cursor-pointer text-zinc-400 hover:text-orange-400 transition-transform hover:scale-110 active:scale-95 active:duration-75 outline-none"
            >
              <div className="flex items-center justify-center h-[28px] w-[36px]">
                <img
                  src={`/assets/flags/${currentLanguage.toLowerCase()}.svg`}
                  width={28}
                  height={20}
                  className="h-[20px] w-[28px] object-cover rounded-sm border border-zinc-700 shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                  alt="Selected Lang"
                />
              </div>
            </button>
          </li>
        </ul>
      </nav>

      {/* Language Drawer */}
      <AnimatePresence>
        {isLangOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto cursor-pointer"
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
                  {languagesDrawerTitle}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
                {routing.locales.map((lang) => (
                  <button
                    key={lang}
                    data-lang={lang}
                    onClick={() => onChangeLanguage(lang)}
                    className={`flex items-center gap-3 p-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors ${lang === currentLanguage
                        ? "bg-orange-600/20 text-orange-500 border border-orange-600/50"
                        : "text-white hover:bg-white/10 border border-transparent"
                      }`}
                  >
                    <img
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
