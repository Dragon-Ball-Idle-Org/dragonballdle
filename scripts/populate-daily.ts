import { createClient } from "@supabase/supabase-js";
import {
  getCharacterIndexForDay,
  getDayIndexBrasilia,
  ymdFromDayIndex,
} from "../src/lib/daily";
import * as dotenv from "dotenv";
import { GameMode } from "@/features/game-engine/types/game-mode";

dotenv.config({ path: ".env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DAYS_AHEAD = 90;
const CDN_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || "";

async function checkAssetExists(path: string): Promise<boolean> {
  if (!path) return false;
  try {
    const res = await fetch(`${CDN_URL}${path}`, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Fetching canonical character list...");

  const { data: characters, error } = await supabase
    .from("characters")
    .select("id, slug, silhouette_path, silhouette_colored_path")
    .order("slug", { ascending: true });

  if (error || !characters?.length) {
    console.error("Failed to fetch characters:", error);
    process.exit(1);
  }

  console.log(`Found ${characters.length} characters`);

  const GAME_MODES = ["classic", "silhouette"];
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

  const rows: { day_index: number; character_id: string; game_mode: string }[] =
    [];

  for (const gameMode of GAME_MODES) {
    const missingDays = Array.from(
      { length: DAYS_AHEAD + 1 },
      (_, i) => todayK + i,
    ).filter((k) => !existingSet.has(k));

    if (!missingDays.length) {
      console.log("All days already populated!");
      return;
    }

    let candidateCharacters = characters;

    if (gameMode === "silhouette") {
      console.log("Verifying silhouette assets in CDN...");
      const filtered = [];
      for (const char of characters) {
        if (!char.silhouette_path || !char.silhouette_colored_path) continue;

        const exists = await checkAssetExists(char.silhouette_path);
        if (exists) {
          filtered.push(char);
        } else {
          console.warn(`  Skipping ${char.slug}: Silhouette asset not found in CDN`);
        }
      }
      candidateCharacters = filtered;
      console.log(`  Silhouette pool size: ${candidateCharacters.length} (from ${characters.length} total)`);
    }

    const N = candidateCharacters.length;

    console.log(
      `Populating ${missingDays.length} missing days for ${gameMode} (${ymdFromDayIndex(missingDays[0])} → ${ymdFromDayIndex(missingDays[missingDays.length - 1])})...`,
    );

    const startK = Math.min(...missingDays);
    const cache: (number | undefined)[] = [];

    const { data: historical } = await supabase
      .from("daily_characters")
      .select("day_index, characters(slug)")
      .lt("day_index", startK)
      .gte("day_index", startK - 30);

    if (historical) {
      for (const row of historical) {
        const slug = (row.characters as unknown as { slug: string })?.slug;
        const charIdx = candidateCharacters.findIndex((c) => c.slug === slug);
        if (charIdx >= 0) cache[row.day_index] = charIdx;
      }
    }

    let currentCache = [...cache];

    for (const k of missingDays) {
      const { index, cache: newCache } = getCharacterIndexForDay(
        k,
        N,
        gameMode as GameMode,
        currentCache,
      );
      currentCache = newCache;

      const character = candidateCharacters[index];
      rows.push({
        day_index: k,
        character_id: character.id,
        game_mode: gameMode,
      });

      console.log(`  Day ${k} (${ymdFromDayIndex(k)}): ${character.slug}`);
    }
  }

  const { error: insertError } = await supabase
    .from("daily_characters")
    .upsert(rows, { onConflict: "day_index, game_mode" });

  if (insertError) {
    console.error("Insert failed:", insertError);
    process.exit(1);
  }

  console.log(`\nDone! ${rows.length} days populated.`);
}

main();
