"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { XIcon, EyeIcon, GameControllerIcon } from "@phosphor-icons/react";
import { CountdownToMidnight } from "./CountdownToMidnight";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { useGameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

type WinModalProps = {
  characterName: string;
  characterImage: string;
  playNextLabel?: string;
};

export function WinModal({ characterName, characterImage, playNextLabel }: WinModalProps) {
  const [openWinModal, setOpenWinModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isGameWon } = useGameContext();
  const { tries } = useGuessesContext();
  const t = useTranslations("winModal");
  const pathname = usePathname();

  const isSilhouette = pathname.startsWith("/silhouette");
  const nextGameHref = isSilhouette ? "/classic" : "/silhouette";
  const NextIcon = isSilhouette ? GameControllerIcon : EyeIcon;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isGameWon) {
      setOpenWinModal(true);
    }
  }, [isGameWon]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {openWinModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-4 pt-[clamp(12px,3vw,24px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenWinModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, scale: 0.65, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.65, y: 20 },
            }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="relative z-10 mx-auto mt-[clamp(8px,6vh,40px)] w-[min(80vw,500px)] overflow-visible rounded-xl border-3 border-[#ffcc00] bg-linear-to-b from-correct-light to-correct-dark p-[clamp(12px,2.5vw,24px)] shadow-[0_0_20px_5px_rgba(255,215,0,0.7)]"
          >
            <div className="relative mb-4 flex justify-center transform -translate-y-[15%] pointer-events-none">
              <div className="relative w-[min(92%,540px)] origin-bottom">
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/win-png.png`}
                  alt="Baba Uranai"
                  width={540}
                  height={400}
                  className="h-auto w-full object-contain"
                />

                <div className="absolute top-[80%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-[36%] aspect-square rounded-full overflow-hidden isolation-isolate">
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 2,
                      filter: "blur(10px) brightness(4)",
                    }}
                    animate={{
                      opacity: 0.75,
                      scale: 1,
                      filter: "blur(0) brightness(1)",
                    }}
                    transition={{
                      delay: 0.2,
                      duration: 1.2,
                      ease: [0.28, 0.79, 0.28, 0.79],
                    }}
                    className="w-full h-full"
                  >
                    <img
                      src={characterImage}
                      alt={characterName}
                      className="object-cover rounded-full w-full h-full"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-5 mt-[-20%] text-center">
              <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-normal text-white drop-shadow-md">
                {t.congrats}
              </h2>

              <p className="font-base text-[clamp(0.875rem,2.3vw,1rem)] font-semibold text-white">
                {t.lineBefore} <strong>{tries}</strong> {t.lineAfter}
              </p>

              <div className="mb-1">
                <span className="inline-block rounded-full bg-primary border-2 border-primary-dark px-4 py-1 font-ui text-[clamp(1.125rem,3vw,1.25rem)] font-black text-white shadow-[inset_0_2px_12px_rgba(230,81,0,0.35),0_2px_10px_rgba(0,0,0,0.12)] text-shadow-md">
                  {characterName}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-md border-1.5 border-white/55 bg-black/12 px-3 py-1 font-ui text-[clamp(0.875rem,2.4vw,1rem)] font-black text-white shadow-[inset_0_2px_12px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-xs">
                <span>⏳ {t.countdown}</span>
                <CountdownToMidnight />
              </div>

              <Link
                href={nextGameHref}
                className={cn(
                  "mt-2 w-full flex items-center justify-center gap-3 py-[clamp(12px,2vw,16px)] px-6 rounded-2xl",
                  "bg-orange-500 border-2 border-black",
                  "shadow-[0_6px_0_#9a3412] active:shadow-none active:translate-y-[4px]",
                  "hover:scale-105 transition-all text-white",
                  "font-display text-[clamp(1.5rem,3.5vw,2rem)] uppercase tracking-wider",
                )}
              >
                <NextIcon weight="fill" className="w-[1.2em] h-[1.2em]" />
                <span className="truncate">{playNextLabel || t.playNewGame}</span>
              </Link>
            </div>

            <button
              onClick={() => setOpenWinModal(false)}
              className="absolute -right-2.5 -top-2.5 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-sm border-2 border-black bg-[#e53935] font-base font-bold text-white transition-transform hover:scale-110 active:scale-95"
              aria-label="Close"
            >
              <XIcon size={18} weight="bold" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
