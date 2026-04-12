import { todayBrasiliaKey } from "@/lib/daily";
import { createClient } from "@/lib/supabase/client";
import type { GameMode } from "@/types/game-mode";

let cachedWinsCount = 0;

export async function getWinsCount(gameMode: GameMode): Promise<number> {
  const supabase = createClient();
  const date = todayBrasiliaKey();

  const { data, error } = await supabase
    .from("wins")
    .select("wins_count")
    .eq("game_date", date)
    .eq("game_mode", gameMode)
    .maybeSingle();

  if (error) {
    console.error("[getWinsCount] Error fetching wins count:", error);
    return 0;
  }

  cachedWinsCount = data?.wins_count ?? 0;

  return cachedWinsCount;
}

export async function incrementWins(gameMode: GameMode): Promise<number> {
  const supabase = createClient();
  const date = todayBrasiliaKey();

  const {
    data: { wins_count },
    error,
  } = await supabase.functions.invoke("increment-wins", {
    body: { date, game_mode: gameMode },
  });

  if (error) {
    console.error("[incrementWins] Error incrementing wins:", error);
    return cachedWinsCount;
  }

  cachedWinsCount = wins_count;
  return wins_count;
}
