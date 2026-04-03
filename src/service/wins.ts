import { createClientWithTag } from "@/lib/supabase/client";

export async function getWinsCount(): Promise<number> {
  const supabase = createClientWithTag("wins");
  const date = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("wins")
    .select("wins_count")
    .eq("game_date", date)
    .maybeSingle();

  if (error) {
    console.error("[getWinsCount] Error fetching wins count:", error);
    return 0;
  }

  return data?.wins_count ?? 0;
}

export async function incrementWins(): Promise<void> {
  const supabase = createClientWithTag("wins");
  const date = new Date().toISOString().split("T")[0];

  const { error } = await supabase.functions.invoke("increment-wins", {
    body: { date },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
    },
  });

  if (error) {
    console.error("[incrementWins] Error incrementing wins:", error);
  }
}
