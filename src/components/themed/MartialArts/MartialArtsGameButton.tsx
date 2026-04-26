"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { CountdownToMidnight } from "../../shared/CountdownToMidnight";
import { motion } from "framer-motion";
import { GameMode } from "@/types/game-mode";
import { useWinsRealtime } from "@/hooks/useWinsRealtime";
import { StarIcon } from "@phosphor-icons/react";

type MartialArtsGameButtonProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  href: string;
  gameMode?: GameMode;
  winsCountTemplate?: string;
};

export function MartialArtsGameButton({
  icon,
  title,
  subtitle,
  href,
  gameMode,
  winsCountTemplate,
}: MartialArtsGameButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 sm:gap-10 w-full sm:w-auto sm:min-w-130 min-h-42 p-3",
        "background-dragon-texture",
        "cursor-pointer transition-all hover:scale-105 sm:hover:scale-110",
        "relative before:absolute before:content-[''] before:inset-0 before:border-24 before:border-transparent before:pointer-events-none before:[border-image:url('/assets/dragon-border.svg')_500_stretch] before:z-1",
      )}
    >
      <div className="px-2 sm:px-5">{icon}</div>
      <div className="flex flex-col items-start">
        <h3 className="text-3xl sm:text-5xl font-display">{title}</h3>
        <span className="text-sm sm:text-base">{subtitle}</span>
        {gameMode && winsCountTemplate && (
          <WinsCounter
            gameMode={gameMode}
            winsCountTemplate={winsCountTemplate}
          />
        )}
      </div>
    </Link>
  );
}

function WinsCounter({
  gameMode,
  winsCountTemplate,
}: {
  gameMode: GameMode;
  winsCountTemplate: string;
}) {
  const { winsCount, isLoading } = useWinsRealtime(gameMode);

  if (winsCount === 0 && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 mt-2 px-3 py-1 bg-black/25 rounded-full border border-white/10 shadow-sm w-fit"
    >
      <div className="flex items-center justify-center w-5 h-5 bg-[#ffcc00] rounded-full border-2 border-red-600 shrink-0 shadow-[0_0_8px_rgba(255,204,0,0.4)]">
        <StarIcon className="w-3 h-3 text-red-600" weight="fill" />
      </div>
      <span className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
        {winsCountTemplate.replace("[count]", winsCount.toString())}
      </span>
    </motion.div>
  );
}

type MartialArtsGameButtonDisabledProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  countDown?: boolean;
};

export function MartialArtsGameButtonDisabled({
  icon,
  title,
  subtitle,
  countDown,
}: MartialArtsGameButtonDisabledProps) {
  return (
    <div className="flex flex-col items-center w-full sm:w-auto">
      <div
        className={cn(
          "flex items-center gap-4 sm:gap-10 w-full sm:w-auto sm:min-w-130 min-h-42 p-3",
          "background-dragon-texture-gray",
          "relative before:absolute before:content-[''] before:inset-0 before:border-24 before:border-transparent before:pointer-events-none before:[border-image:url('/assets/dragon-border-gray.svg')_500_stretch] before:z-1",
        )}
      >
        <div className="px-2 sm:px-5 grayscale opacity-70">{icon}</div>
        <div className="flex flex-col items-start opacity-70">
          <h3 className="text-3xl sm:text-5xl font-display">{title}</h3>
          <span className="text-sm sm:text-base">{subtitle}</span>
        </div>
      </div>

      {countDown && (
        <motion.div
          className="flex flex-col items-center w-full relative -mt-3 z-10"
          initial={{ rotate: -1.2 }}
          animate={{ rotate: 1.2 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 4,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "top center",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between w-full max-w-[210px] px-10 -mb-3.5 relative z-10 pointer-events-none">
            <MartialArtsChain />
            <MartialArtsChain />
          </div>

          <div className="flex items-center justify-center w-full py-1 px-2">
            <div
              className={cn(
                "relative bg-[#ffcc00] px-8 py-3 min-w-[250px] text-center",
                "border-[6px] border-red-light shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
                "rounded-sm",
                "bg-radial-[circle_at_center,var(--tw-gradient-stops)] from-[#ffcc00] via-[#ffb900] to-[#ffa000]",
              )}
            >
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#3e2723]/30" />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3e2723]/30" />
              <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-[#3e2723]/30" />
              <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#3e2723]/30" />

              <div className="relative z-20 flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-red-light flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] shrink-0">
                  <span className="font-display text-red-light text-2xl mt-1">
                    天
                  </span>
                </div>

                <div className="flex flex-col items-start leading-none text-left">
                  {/* <span className="block text-[#3e2723] font-display text-[12px] uppercase tracking-[0.2em] mb-1">
                    Próximo Combate
                  </span> */}
                  <CountdownToMidnight className="font-display text-4xl text-red-light drop-shadow-[0_2px_1px_rgba(0,0,0,0.2)] tabular-nums" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MartialArtsChain() {
  return (
    <div className="flex flex-col items-center -space-y-2.5 drop-shadow-[0_6px_4px_rgba(0,0,0,0.5)] z-30">
      <div className="w-6 h-3 bg-[#3e2723] rounded-b-sm relative z-20 shadow-inner" />
      <ChainLink isEven />
      <ChainLink />
      <ChainLink isEven />
      <div className="w-4 h-4 bg-[#5d4037] border-2 border-[#3e2723] rounded-full relative z-20 shadow-md" />
    </div>
  );
}

function ChainLink({ isEven }: { isEven?: boolean }) {
  return (
    <div
      className={cn(
        "border-2 border-[#2a1a17] bg-[#4a342f] rounded-full relative",
        isEven ? "w-5 h-3 z-10" : "w-2.5 h-6 z-0",
      )}
      style={{
        boxShadow:
          "inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.5)",
      }}
    >
      <div className="absolute inset-0.5 border border-white/5 rounded-full" />
    </div>
  );
}
