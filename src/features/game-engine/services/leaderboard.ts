import { todayBrasiliaKey } from "@/lib/daily";
import { createClient } from "@/lib/supabase/client";
import { GameMode } from "@/features/game-engine/types/game-mode";

export async function recordGuess(
  gameMode: GameMode,
  guessCount: number,
): Promise<void> {
  const supabase = createClient();
  const date = todayBrasiliaKey();

  try {
    await supabase.functions.invoke("record-guess", {
      body: { date, game_mode: gameMode, guess_count: guessCount },
    });
  } catch (err) {
    console.error("[recordGuess] Unexpected error:", err);
  }
}

export async function getGuessDistribution(
  gameMode: GameMode,
): Promise<Record<number, number>> {
  const supabase = createClient();
  const date = todayBrasiliaKey();

  const { data, error } = await supabase
    .from("guess_distribution")
    .select("guess_count, count")
    .eq("game_mode", gameMode)
    .eq("game_date", date);

  if (error) {
    console.error("[getGuessDistribution] Error fetching distribution:", error);
    return {};
  }

  const distribution: Record<number, number> = {};
  data?.forEach((item) => {
    distribution[item.guess_count] = Number(item.count);
  });

  return distribution;
}
