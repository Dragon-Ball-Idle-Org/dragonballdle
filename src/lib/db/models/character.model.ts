export interface CachedCharacter {
  slug: string;
  locale: string;
  cachedAt: number;
  thumb_path: string;
  has_transformations: boolean;
  name: string;
  gender: {
    slug: string;
    name: string;
  };
  series: {
    slug: string;
    name: string;
  };
  debut_saga: {
    slug: string;
    name: string;
    sort_order: number;
  };
  races: Array<{
    slug: string;
    name: string;
  }>;
  affiliations: Array<{
    slug: string;
    name: string;
  }>;
  attributes: Array<{
    slug: string;
    name: string;
  }>;
}