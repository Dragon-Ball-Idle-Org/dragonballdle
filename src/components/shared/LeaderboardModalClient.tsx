"use client";

import { GameMode } from "@/features/game-engine/types/game-mode";
import dynamic from "next/dynamic";

const LeaderboardModal = dynamic(
  () =>
    import("@/components/shared/LeaderboardModal").then(
      (mod) => mod.LeaderboardModal,
    ),
  { ssr: false },
);

interface LeaderboardModalClientProps {
  gameMode: GameMode;
  currentGuessCount?: number;
  trigger?: React.ReactNode;
  className?: string;
}

export function LeaderboardModalClient(props: LeaderboardModalClientProps) {
  return <LeaderboardModal {...props} />;
}
