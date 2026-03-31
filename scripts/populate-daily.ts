import { createClient } from "@supabase/supabase-js";
import {
  getCharacterIndexForDay,
  getDayIndex,
  ymdFromDayIndex,
} from "../src/lib/daily";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DAYS_AHEAD = 90; // quantos dias à frente popular

async function main() {
  console.log("Fetching canonical character list...");

  // busca todos os personagens em ordem canônica (slug sort — equivalente ao getCanonicalList)
  const { data: characters, error } = await supabase
    .from("characters")
    .select("id, slug")
    .order("slug", { ascending: true });

  if (error || !characters?.length) {
    console.error("Failed to fetch characters:", error);
    process.exit(1);
  }

  console.log(`Found ${characters.length} characters`);

  const N = characters.length;
  const todayK = getDayIndex();
  const targetK = todayK + DAYS_AHEAD;

  // verifica quais dias já estão populados
  const { data: existing } = await supabase
    .from("daily_characters")
    .select("day_index")
    .gte("day_index", todayK)
    .lte("day_index", targetK);

  const existingSet = new Set((existing ?? []).map((r) => r.day_index));
  const missingDays = Array.from(
    { length: DAYS_AHEAD + 1 },
    (_, i) => todayK + i,
  ).filter((k) => !existingSet.has(k));

  if (!missingDays.length) {
    console.log("All days already populated!");
    return;
  }

  console.log(
    `Populating ${missingDays.length} missing days (${ymdFromDayIndex(missingDays[0])} → ${ymdFromDayIndex(missingDays[missingDays.length - 1])})...`,
  );

  // precisa calcular sequencialmente desde o início para o algoritmo de janela funcionar
  const startK = Math.min(...missingDays);
  const cache: (number | undefined)[] = [];

  // pré-carrega cache com dias já existentes no banco (para a janela WINDOW_DAYS funcionar)
  const { data: historical } = await supabase
    .from("daily_characters")
    .select("day_index, characters(slug)")
    .lt("day_index", startK)
    .gte("day_index", startK - 30);

  if (historical) {
    for (const row of historical) {
      const slug = (row.characters as unknown as { slug: string })?.slug;
      const charIdx = characters.findIndex((c) => c.slug === slug);
      if (charIdx >= 0) cache[row.day_index] = charIdx;
    }
  }

  // calcula os índices para os dias que faltam
  const rows: { day_index: number; character_id: string }[] = [];
  let currentCache = [...cache];

  for (const k of missingDays) {
    const { index, cache: newCache } = getCharacterIndexForDay(
      k,
      N,
      currentCache,
    );
    currentCache = newCache;

    const character = characters[index];
    rows.push({ day_index: k, character_id: character.id });

    console.log(`  Day ${k} (${ymdFromDayIndex(k)}): ${character.slug}`);
  }

  // insere em batch
  const { error: insertError } = await supabase
    .from("daily_characters")
    .upsert(rows, { onConflict: "day_index" });

  if (insertError) {
    console.error("Insert failed:", insertError);
    process.exit(1);
  }

  console.log(`\nDone! ${rows.length} days populated.`);
}

main();
