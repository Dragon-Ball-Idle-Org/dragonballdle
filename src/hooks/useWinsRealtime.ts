"use client";

import { createClient } from "@/lib/supabase/client";
import { getWinsCount } from "@/service/wins";
import { GameMode } from "@/types/game-mode";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useWinsRealtime(gameMode: GameMode) {
  const [winsCount, setWinsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentWinsCount = async () => {
    try {
      setIsLoading(true);
      const count = await getWinsCount(gameMode);
      setWinsCount(count);
    } finally {
      setIsLoading(false);
    }
  };

  const initTodayWinsCountChangeListener = (supabase: SupabaseClient) => {
    const today = new Date().toISOString().split("T")[0];

    return supabase
      .channel(`wins-${gameMode}-${today}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wins",
          filter: `game_mode=eq.${gameMode}`,
        },
        (payload) => {
          if (process.env.NODE_ENV === "development") {
            console.log("Received new win row:", payload);
          }
          setWinsCount(payload.new.wins_count);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wins",
          filter: `game_mode=eq.${gameMode}`,
        },
        (payload) => {
          if (process.env.NODE_ENV === "development") {
            console.log("Received wins update:", payload);
          }
          setWinsCount(payload.new.wins_count);
        },
      )
      .subscribe();
  };

  useEffect(() => {
    getCurrentWinsCount();

    const supabase = createClient();
    const channel = initTodayWinsCountChangeListener(supabase);
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { winsCount, isLoading };
}
