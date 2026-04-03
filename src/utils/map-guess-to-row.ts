import { CharacterGuess, GuessStatus } from "@/types/guess";

export function compareGuess(guess: CharacterGuess, answer: CharacterGuess) {
  return {
    id: guess.slug,

    character: {
      status:
        guess.slug === answer.slug ? GuessStatus.CORRECT : GuessStatus.WRONG,
    },

    gender: {
      status:
        guess.gender.slug === answer.gender.slug
          ? GuessStatus.CORRECT
          : GuessStatus.WRONG,
    },

    race: {
      status: guess.races.some((r) =>
        answer.races.some((a) => a.slug === r.slug),
      )
        ? GuessStatus.PARTIAL
        : GuessStatus.WRONG,
    },

    affiliation: {
      status: guess.affiliations.some((a) =>
        answer.affiliations.some((b) => b.slug === a.slug),
      )
        ? GuessStatus.PARTIAL
        : GuessStatus.WRONG,
    },

    transformation: {
      status:
        guess.has_transformations === answer.has_transformations
          ? GuessStatus.CORRECT
          : GuessStatus.WRONG,
    },

    attribute: {
      status: guess.attributes.some((a) =>
        answer.attributes.some((b) => b.slug === a.slug),
      )
        ? GuessStatus.PARTIAL
        : GuessStatus.WRONG,
    },

    series: {
      status:
        guess.series.slug === answer.series.slug
          ? GuessStatus.CORRECT
          : GuessStatus.WRONG,
    },

    debut_saga: {
      status:
        guess.debut_saga.sort_order === answer.debut_saga.sort_order
          ? GuessStatus.CORRECT
          : guess.debut_saga.sort_order > answer.debut_saga.sort_order
            ? GuessStatus.OLDEST // ⬇️
            : GuessStatus.NEWEST, // ⬆️
    },
  };
}
