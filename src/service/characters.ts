import { createClientWithTag } from "@/lib/supabase/client";
import { CharacterGuess } from "@/types/guess";

export async function searchCharacters(query: string, locale: string) {
  if (query.length < 2) return [];

  const supabase = createClientWithTag("characters");

  const { data } = await supabase.rpc("search_characters", {
    query,
    loc: locale,
  });

  return data ?? [];
}

export async function getCharacterBySlug(
  slug: string,
  locale: string,
): Promise<CharacterGuess | null> {
  const supabase = createClientWithTag("characters");

  const { data } = await supabase
    .rpc("get_character_with_translations", { p_slug: slug, p_locale: locale })
    .single();

  return data ?? null;
}
