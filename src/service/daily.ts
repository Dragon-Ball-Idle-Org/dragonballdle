import { createClient } from "@/lib/supabase/server";
import { getDayIndexBrasilia } from "@/lib/daily";
import {
  ClassicCharacter,
  YesterdayCharacter,
  SilhouetteCharacter,
} from "@/types/guess";
import {
  AffiliationJoin,
  AttributeJoin,
  DailyCharacterRow,
  RaceJoin,
} from "@/types/supabase-joins";

function mapToClassicCharacter(c: DailyCharacterRow): ClassicCharacter {
  const mapIfExists = <T, U>(
    array: T[] | undefined | null,
    mapper: (item: T) => U,
  ): U[] | null => {
    return array && array.length > 0 ? array.map(mapper) : null;
  };

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
    races: mapIfExists(c.character_races, (cr: RaceJoin) => ({
      slug: cr.races?.slug ?? "",
      name: cr.races?.race_translations[0]?.name ?? "",
    })),
    affiliations: mapIfExists(
      c.character_affiliations,
      (ca: AffiliationJoin) => ({
        slug: ca.affiliations?.slug ?? "",
        name: ca.affiliations?.affiliation_translations[0]?.name ?? "",
      }),
    ),
    attributes: mapIfExists(c.character_attributes, (ca: AttributeJoin) => ({
      slug: ca.attributes?.slug ?? "",
      name: ca.attributes?.attribute_translations[0]?.name ?? "",
    })),
  };
}

export async function getDailyCharacter(
  locale: string,
): Promise<ClassicCharacter | null> {
  const supabase = createClient();
  const dayIndex = getDayIndexBrasilia();

  const threatedLocale = locale.toLowerCase();

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
    .eq("game_mode", "classic")
    .eq("characters.character_translations.locale", threatedLocale)
    .eq("characters.genders.gender_translations.locale", threatedLocale)
    .eq("characters.series.series_translations.locale", threatedLocale)
    .eq("characters.sagas.saga_translations.locale", threatedLocale)
    .eq(
      "characters.character_races.races.race_translations.locale",
      threatedLocale,
    )
    .eq(
      "characters.character_affiliations.affiliations.affiliation_translations.locale",
      threatedLocale,
    )
    .eq(
      "characters.character_attributes.attributes.attribute_translations.locale",
      threatedLocale,
    )
    .single();

  if (error || !data?.characters) {
    console.log("data", data);
    console.error("error", error);
    return null;
  }

  return mapToClassicCharacter(data.characters);
}

export async function getYesterdayCharacter(
  locale: string,
): Promise<YesterdayCharacter | null> {
  const supabase = createClient();
  const dayIndex = getDayIndexBrasilia() - 1;

  const threatedLocale = locale.toLowerCase();

  const { data, error } = await supabase
    .from("daily_characters")
    .select(
      `
      day_index,
      characters (
        slug,
        thumb_path,
        character_translations!inner (name)
      )
    `,
    )
    .eq("day_index", dayIndex)
    .eq("game_mode", "classic")
    .eq("characters.character_translations.locale", threatedLocale)
    .single();

  if (error || !data?.characters) {
    console.log("data", data);
    console.error("error", error);
    return null;
  }

  return {
    slug: data.characters.slug,
    name:
      data.characters.character_translations[0]?.name ?? data.characters.slug,
    thumb_path: data.characters.thumb_path,
  };
}

export async function getDailySilhouetteCharacter(
  locale: string,
): Promise<SilhouetteCharacter | null> {
  const supabase = createClient();
  const dayIndex = getDayIndexBrasilia();

  const threatedLocale = locale.toLowerCase();

  const { data, error } = await supabase
    .from("daily_characters")
    .select(
      `
      day_index,
      characters (
        slug,
        thumb_path,
        silhouette_path,
        silhouette_colored_path,
        character_translations!inner (name)
      )
    `,
    )
    .eq("day_index", dayIndex)
    .eq("game_mode", "silhouette")
    .eq("characters.character_translations.locale", threatedLocale)
    .single();

  if (error || !data?.characters) {
    console.log("data", data);
    console.error("error", error);
    return null;
  }

  return {
    slug: data.characters.slug,
    name:
      data.characters.character_translations[0]?.name ?? data.characters.slug,
    thumb_path: data.characters.thumb_path,
    silhouette_path: data.characters.silhouette_path,
    silhouette_colored_path: data.characters.silhouette_colored_path,
  };
}

export async function getYesterdaySilhouetteCharacter(
  locale: string,
): Promise<YesterdayCharacter | null> {
  const supabase = createClient();
  const dayIndex = getDayIndexBrasilia() - 1;

  const threatedLocale = locale.toLowerCase();

  const { data, error } = await supabase
    .from("daily_characters")
    .select(
      `
      day_index,
      characters (
        slug,
        thumb_path,
        character_translations!inner (name)
      )
    `,
    )
    .eq("day_index", dayIndex)
    .eq("game_mode", "silhouette")
    .eq("characters.character_translations.locale", threatedLocale)
    .single();

  if (error || !data?.characters) {
    console.log("data", data);
    console.error("error", error);
    return null;
  }

  return {
    slug: data.characters.slug,
    name:
      data.characters.character_translations[0]?.name ?? data.characters.slug,
    thumb_path: data.characters.thumb_path,
  };
}
