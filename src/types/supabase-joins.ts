export type TranslationRow = { name: string };
export type RaceJoin = {
  races: { slug: string; race_translations: TranslationRow[] };
};
export type AffiliationJoin = {
  affiliations: { slug: string; affiliation_translations: TranslationRow[] };
};
export type AttributeJoin = {
  attributes: { slug: string; attribute_translations: TranslationRow[] };
};

export type DailyCharacterRow = {
  slug: string;
  thumb_path: string | null;
  image_path: string | null;
  has_transformations: boolean;
  character_translations: TranslationRow[];
  genders: {
    slug: string;
    gender_translations: TranslationRow[];
  } | null;
  series: {
    slug: string;
    series_translations: TranslationRow[];
  } | null;
  sagas: {
    slug: string;
    sort_order: number;
    saga_translations: TranslationRow[];
  } | null;
  character_races: RaceJoin[];
  character_affiliations: AffiliationJoin[];
  character_attributes: AttributeJoin[];
};
