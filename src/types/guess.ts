export enum GuessStatus {
  CORRECT,
  PARTIAL,
  WRONG,
  OLDEST,
  NEWEST,
}

export type YesterdayCharacter= {
  slug: string;
  name: string;
  thumb_path: string | null;
}

export type ClassicCharacter = {
  slug: string;
  name: string;
  thumb_path: string | null;
  image_path: string | null;
  gender: { slug: string | null; name: string | null };
  races: { slug: string | null; name: string | null }[];
  series: { slug: string | null; name: string | null };
  debut_saga: { slug: string; name: string; sort_order: number };
  affiliations: { slug: string | null; name: string | null }[];
  attributes: { slug: string | null; name: string | null }[];
  has_transformations: boolean;
};

export type CharacterGuess = {
  slug: string;
  name: string;
  thumb_path: string | null;
  gender: { slug: string; name: string };
  races: { slug: string; name: string }[];
  series: { slug: string; name: string };
  debut_saga: { slug: string; name: string; sort_order: number };
  affiliations: { slug: string; name: string }[];
  attributes: { slug: string; name: string }[];
  has_transformations: boolean;
};

export function compareValue(guessed: string, daily: string): GuessStatus {
  return guessed === daily ? GuessStatus.CORRECT : GuessStatus.WRONG;
}

export function compareSaga(
  guessed: { slug: string; sort_order: number },
  daily: { slug: string; sort_order: number },
): GuessStatus {
  if (guessed.slug === daily.slug) return GuessStatus.CORRECT;
  if (guessed.sort_order < daily.sort_order) return GuessStatus.NEWEST;
  return GuessStatus.OLDEST;
}

export function compareTransformation(
  guessed: boolean,
  daily: boolean,
): GuessStatus {
  return guessed === daily ? GuessStatus.CORRECT : GuessStatus.WRONG;
}
