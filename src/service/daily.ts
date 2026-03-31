import { createClient } from "@/lib/supabase/server";
import { getDayIndex } from "@/lib/daily";
import { ClassicCharacter } from "@/types/guess";
import {
  AffiliationJoin,
  AttributeJoin,
  DailyCharacterRow,
  RaceJoin,
} from "@/types/supabase-joins";

function mapToClassicCharacter(c: DailyCharacterRow): ClassicCharacter {
  return {
    slug: c.slug,
    thumb_path: c.thumb_path,
    image_path: c.image_path,
    has_transformations: c.has_transformations,
    name: c.character_translations[0]?.name ?? c.slug,
    gender: {
      slug: c.genders?.slug ?? "",
      name: c.genders?.gender_translations[0]?.name ?? "",
    },
    series: {
      slug: c.series?.slug ?? "",
      name: c.series?.series_translations[0]?.name ?? "",
    },
    debut_saga: {
      slug: c.sagas?.slug ?? "",
      name: c.sagas?.saga_translations[0]?.name ?? "",
      sort_order: c.sagas?.sort_order ?? 0,
    },
    races: (c.character_races ?? []).map((cr: RaceJoin) => ({
      slug: cr.races?.slug ?? "",
      name: cr.races?.race_translations[0]?.name ?? "",
    })),
    affiliations: (c.character_affiliations ?? []).map(
      (ca: AffiliationJoin) => ({
        slug: ca.affiliations?.slug ?? "",
        name: ca.affiliations?.affiliation_translations[0]?.name ?? "",
      }),
    ),
    attributes: (c.character_attributes ?? []).map((ca: AttributeJoin) => ({
      slug: ca.attributes?.slug ?? "",
      name: ca.attributes?.attribute_translations[0]?.name ?? "",
    })),
  };
}

export async function getDailyCharacter(
  locale: string,
): Promise<ClassicCharacter | null> {
  const supabase = createClient();
  const dayIndex = getDayIndex();

  const { data, error } = await supabase
    .from("daily_characters")
    .select(
      `
      day_index,
      characters (
        slug,
        thumb_path,
        image_path,
        has_transformations,
        character_translations!inner (name),
        genders (
          slug,
          gender_translations!inner (name)
        ),
        series (
          slug,
          series_translations!inner (name)
        ),
        sagas (
          slug,
          sort_order,
          saga_translations!inner (name)
        ),
        character_races (
          races (
            slug,
            race_translations!inner (name)
          )
        ),
        character_affiliations (
          affiliations (
            slug,
            affiliation_translations!inner (name)
          )
        ),
        character_attributes (
          attributes (
            slug,
            attribute_translations!inner (name)
          )
        )
      )
    `,
    )
    .eq("day_index", dayIndex)
    .eq("characters.character_translations.locale", locale)
    .eq("characters.genders.gender_translations.locale", locale)
    .eq("characters.series.series_translations.locale", locale)
    .eq("characters.sagas.saga_translations.locale", locale)
    .eq("characters.character_races.races.race_translations.locale", locale)
    .eq(
      "characters.character_affiliations.affiliations.affiliation_translations.locale",
      locale,
    )
    .eq(
      "characters.character_attributes.attributes.attribute_translations.locale",
      locale,
    )
    .single();

  if (error || !data?.characters) return null;

  return mapToClassicCharacter(data.characters);
}
