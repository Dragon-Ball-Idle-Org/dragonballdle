import { createClient } from "jsr:@supabase/supabase-js@2";
import { getCharacterIndexForDay, getDayIndexBrasilia } from "./daily.ts";

const DAYS_AHEAD = 90;

async function checkAssetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: characters } = await supabase
    .from("characters")
    .select("id, slug, silhouette_path, silhouette_colored_path")
    .order("slug", { ascending: true });

  if (!characters?.length) {
    return new Response("No characters found", { status: 500 });
  }

  const GAME_MODES = ["classic", "silhouette"];
  const CDN_URL = Deno.env.get("NEXT_PUBLIC_CDN_BASE_URL") || "";
  const todayK = getDayIndexBrasilia();
  const tomorrowK = todayK + 1;
  const targetK = todayK + DAYS_AHEAD;

  // Limpa registros futuros para repopular personagens futuros
  await supabase.from("daily_characters").delete().gte("day_index", tomorrowK);

  const { data: existing } = await supabase
    .from("daily_characters")
    .select("day_index")
    .gte("day_index", todayK)
    .lte("day_index", targetK);

  const existingSet = new Set((existing ?? []).map((r) => r.day_index));
  
  const rows: { day_index: number; character_id: string; game_mode: string }[] = [];

  for (const gameMode of GAME_MODES) {
    const missingDays = Array.from(
      { length: DAYS_AHEAD + 1 },
      (_, i) => todayK + i,
    ).filter((k) => !existingSet.has(k));

    if (!missingDays.length) {
      continue;
    }

    let candidateCharacters = characters;

    if (gameMode === "silhouette") {
      const filtered = [];
      for (const char of characters) {
        if (!char.silhouette_path || !char.silhouette_colored_path) continue;
        const exists = await checkAssetExists(`${CDN_URL}${char.silhouette_path}`);
        if (exists) filtered.push(char);
      }
      candidateCharacters = filtered;
    }

    const N = candidateCharacters.length;
    if (N === 0) continue;

    const startK = Math.min(...missingDays);
    const { data: historical } = await supabase
      .from("daily_characters")
      .select("day_index, characters(slug)")
      .lt("day_index", startK)
      .gte("day_index", startK - 30);

    const cache: (number | undefined)[] = [];
    for (const row of historical ?? []) {
      const slug = (row.characters as any)?.slug;
      const charIdx = candidateCharacters.findIndex((c: any) => c.slug === slug);
      if (charIdx >= 0) cache[row.day_index] = charIdx;
    }

    let currentCache = [...cache];

    for (const k of missingDays) {
      const { index, cache: newCache } = getCharacterIndexForDay(
        k,
        N,
        gameMode,
        currentCache,
      );
      currentCache = newCache;
      rows.push({ day_index: k, character_id: candidateCharacters[index].id, game_mode: gameMode });
    }
  }

  if (rows.length === 0) {
    return new Response(JSON.stringify({ message: "Already up to date" }), {
      status: 200,
    });
  }

  const { error } = await supabase
    .from("daily_characters")
    .upsert(rows, { onConflict: "day_index, game_mode" });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ populated: rows.length }), {
    status: 200,
  });
});
