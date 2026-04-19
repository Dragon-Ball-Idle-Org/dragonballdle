"use client";

import { Link } from "@/i18n/navigation";
import { InfoIcon, ListIcon, StarIcon, LinkIcon } from "@phosphor-icons/react";
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
  legalTitle: string;
  supportUsTitle: string;
};

const MobileThematicNode = ({ isWon, isActive }: { isWon: boolean; isActive: boolean }) => {
  if (isWon) {
    return (
      <div className="relative w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-red-600 border border-orange-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(249,115,22,0.8)] flex items-center justify-center overflow-hidden">
        <StarIcon weight="fill" className="text-red-700 w-4 h-4 z-10" />
        <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="relative w-8 h-8 flex-shrink-0 rounded-full bg-zinc-900 border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 border border-green-500/30 rounded-full scale-150" />
        <div className="absolute w-[150%] h-[1px] bg-green-500/30 rotate-45" />
        <div className="absolute w-[150%] h-[1px] bg-green-500/30 -rotate-45" />
        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
        <div className="absolute w-1.5 h-1.5 bg-green-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-700 border border-zinc-800 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
      <StarIcon weight="fill" className="text-zinc-800/40 w-4 h-4" />
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
  legalTitle,
  supportUsTitle,
}: BottomNavBarProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t-2 border-orange-600 shadow-[0_-4px_20px_rgba(234,88,12,0.2)] z-40 pb-safe">
        <div className="absolute top-[35%] left-[32%] right-[32%] h-0 border-t-[3px] border-dashed border-zinc-700/60 -translate-y-1/2 z-0 pointer-events-none" />

        <ul className="flex justify-around items-end pb-3 pt-2 h-[72px] px-2 relative z-10 w-full">
          <li className="flex-1 flex justify-center pb-1">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer group"
            >
              <ListIcon weight="bold" size={24} className="group-active:scale-95 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{socialLinksTitle?.split(' ')[0] || 'Menu'}</span>
            </button>
          </li>

          <li className="flex-1 flex justify-center">
            <Link
              href="/classic"
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-transform group",
                !isClassicActive && wonModes.classic && "opacity-80"
              )}
            >
              <div className={cn(
                "rounded-full p-1 transition-all duration-300",
                isClassicActive ? "border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] bg-black/60 scale-110" : "border-2 border-transparent scale-95"
              )}>
                <MobileThematicNode isWon={wonModes.classic} isActive={isClassicActive} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider max-w-[65px] truncate text-center",
                isClassicActive ? "text-orange-400" : (wonModes.classic ? "text-zinc-500" : "text-white")
              )}>
                {classicTitle}
              </span>
            </Link>
          </li>

          <li className="flex-none px-2 relative -top-6">
            <Link
              href="/"
              className="flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 active:duration-75"
            >
              <div className="rounded-full p-1.5 border-2 border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)] bg-black/80 backdrop-blur-md">
                <img
                  src="/assets/dragon-radar.svg"
                  alt="Home"
                  width={60}
                  height={60}
                  className="w-12 h-12"
                />
              </div>
            </Link>
          </li>

          <li className="flex-1 flex justify-center">
            <Link
              href="/silhouette"
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-transform group",
                !isSilhouetteActive && wonModes.silhouette && "opacity-80"
              )}
            >
              <div className={cn(
                "rounded-full p-1 transition-all duration-300",
                isSilhouetteActive ? "border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] bg-black/60 scale-110" : "border-2 border-transparent scale-95"
              )}>
                <MobileThematicNode isWon={wonModes.silhouette} isActive={isSilhouetteActive} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider max-w-[65px] truncate text-center",
                isSilhouetteActive ? "text-orange-400" : (wonModes.silhouette ? "text-zinc-500" : "text-white")
              )}>
                {silhouetteTitle}
              </span>
            </Link>
          </li>

          <li className="flex-1 flex justify-center pb-1">
            <button
              onClick={() => setIsLangOpen(true)}
              title={changeLanguageButtonTitle}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer text-zinc-400 hover:text-orange-400 transition-colors"
            >
              <div className="flex items-center justify-center">
                <img
                  src={`/assets/flags/${currentLanguage.toLowerCase()}.svg`}
                  width={24}
                  height={16}
                  className="h-4 w-auto object-cover rounded-xs border border-zinc-700 shadow-md"
                  alt="Selected Lang"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{currentLanguage.toUpperCase()}</span>
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
              className="relative w-64 h-full bg-zinc-950 border-l-2 border-orange-600 shadow-[-10px_0_30_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto"
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

      <AnimatePresence>
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-start">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative w-64 h-full bg-zinc-950 border-r-2 border-orange-600 shadow-[10px_0_30px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-center p-6 border-b border-zinc-800 flex-col gap-2">
                <img
                  src="/assets/dragon-radar.svg"
                  alt="DragonBallDle"
                  width={60}
                  height={60}
                  className="w-12 h-12 drop-shadow-[0_0_10px_rgba(234,88,12,0.6)]"
                />
                <span className="font-display text-xl text-white tracking-widest uppercase">
                  Menu
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <h3 className="text-xs uppercase text-zinc-500 font-bold ml-2">Links</h3>
                  <div className="flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                    <SocialLinksModal
                      title={socialLinksTitle}
                      roles={roles}
                      className="flex items-center gap-3 p-4 text-zinc-300 hover:text-orange-400 hover:bg-zinc-800 transition-colors w-full border-b border-zinc-800 cursor-pointer"
                    >
                      <LinkIcon weight="fill" size={24} />
                      <span className="font-bold text-sm uppercase tracking-wide">{socialLinksTitle}</span>
                    </SocialLinksModal>

                    <Link
                      href="/legal"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 text-zinc-300 hover:text-orange-400 hover:bg-zinc-800 transition-colors w-full"
                    >
                      <InfoIcon weight="fill" size={24} />
                      <span className="font-bold text-sm uppercase tracking-wide">{legalTitle}</span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <h3 className="text-xs uppercase text-zinc-500 font-bold ml-2">{supportUsTitle}</h3>
                  <a
                    href="https://buymeacoffee.com/dragonballdle"
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-3 p-4 rounded-xl text-white transition-colors bg-gradient-to-r from-orange-600 to-amber-600 shadow-[0_4px_15px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95"
                  >
                    <img
                      src="/assets/buy-me-a-coffe.svg"
                      alt="Buy me a coffe"
                      width={28}
                      height={28}
                      className="w-7 h-7"
                    />
                    <span className="font-bold text-sm uppercase tracking-wide">{supportUsTitle}</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
