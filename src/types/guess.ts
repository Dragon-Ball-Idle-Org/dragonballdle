export enum GuessStatus {
  CORRECT,
  PARTIAL,
  WRONG,
  OLDEST,
  NEWEST,
}

export type CharacterGuess = {
  slug: string;
  name: string;
  thumb_path: string | null;
  gender: { slug: string; name: string };
  race: { slug: string; name: string }[];
  series: { slug: string; name: string };
  debut_saga: { slug: string; name: string; sort_order: number };
  affiliations: { slug: string; name: string }[];
  attributes: { slug: string; name: string }[];
  has_transformation: boolean;
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
