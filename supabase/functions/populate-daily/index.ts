import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  getCharacterIndexForDay,
  getDayIndex,
} from "./daily.ts";

const DAYS_AHEAD = 90;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: characters } = await supabase
    .from("characters")
    .select("id, slug")
    .order("slug", { ascending: true });

  if (!characters?.length) {
    return new Response("No characters found", { status: 500 });
  }

  const N = characters.length;
  const todayK = getDayIndex();
  const targetK = todayK + DAYS_AHEAD;

  // verifica dias já populados
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
    return new Response(JSON.stringify({ message: "Already up to date" }), {
      status: 200,
    });
  }

  // pré-carrega histórico recente para janela de exclusão
  const startK = Math.min(...missingDays);
  const { data: historical } = await supabase
    .from("daily_characters")
    .select("day_index, characters(slug)")
    .lt("day_index", startK)
    .gte("day_index", startK - 30);

  const cache: (number | undefined)[] = [];
  for (const row of historical ?? []) {
    const slug = (row.characters as any)?.slug;
    const charIdx = characters.findIndex((c) => c.slug === slug);
    if (charIdx >= 0) cache[row.day_index] = charIdx;
  }

  // calcula e insere
  const rows: { day_index: number; character_id: string }[] = [];
  let currentCache = [...cache];

  for (const k of missingDays) {
    const { index, cache: newCache } = getCharacterIndexForDay(
      k,
      N,
      currentCache,
    );
    currentCache = newCache;
    rows.push({ day_index: k, character_id: characters[index].id });
  }

  const { error } = await supabase
    .from("daily_characters")
    .upsert(rows, { onConflict: "day_index" });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ populated: rows.length }), {
    status: 200,
  });
});
