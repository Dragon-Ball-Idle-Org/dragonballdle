"use client";

import { createClient } from "@/lib/supabase/client";
import { getWinsCount } from "@/service/wins";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useWinsRealtime() {
  const [winsCount, setWinsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentWinsCount = async () => {
    try {
      setIsLoading(true);
      const count = await getWinsCount();
      setWinsCount(count);
    } finally {
      setIsLoading(false);
    }
  };

  const initTodayWinsCountChangeListener = (supabase: SupabaseClient) => {
    const today = new Date().toISOString().split("T")[0];

    return supabase
      .channel("global-wins")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wins",
          filter: `game_date=eq.${today}`,
        },
        (payload) => {
          if (process.env.NODE_ENV === "development") {
            console.log("Received wins count update:", payload);
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
