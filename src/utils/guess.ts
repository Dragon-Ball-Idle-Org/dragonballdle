import { CharacterGuess, compareSaga } from "@/types/guess";
import { GuessStatus } from "@/types/guess";

function compareArrayField(
  guessArr?: { slug: string }[] | null,
  answerArr?: { slug: string }[] | null,
): GuessStatus {
  const guessSafe = guessArr ?? [];
  const answerSafe = answerArr ?? [];

  const isBothEmpty = guessSafe.length === 0 && answerSafe.length === 0;

  const hasExactMatch =
    guessSafe.length === answerSafe.length &&
    guessSafe.every((g) => answerSafe.some((a) => a.slug === g.slug));

  const hasPartialMatch = guessSafe.some((g) =>
    answerSafe.some((a) => a.slug === g.slug),
  );

  if (isBothEmpty) return GuessStatus.CORRECT;
  if (hasExactMatch) return GuessStatus.CORRECT;
  if (hasPartialMatch) return GuessStatus.PARTIAL;
  return GuessStatus.WRONG;
}

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
      status: compareArrayField(guess.races, answer.races),
    },

    affiliation: {
      status: compareArrayField(guess.affiliations, answer.affiliations),
    },

    transformation: {
      status:
        guess.has_transformations === answer.has_transformations
          ? GuessStatus.CORRECT
          : GuessStatus.WRONG,
    },

    attribute: {
      status: compareArrayField(guess.attributes, answer.attributes),
    },

    series: {
      status:
        guess.series.slug === answer.series.slug
          ? GuessStatus.CORRECT
          : GuessStatus.WRONG,
    },

    debut_saga: {
      status: compareSaga(guess.debut_saga, answer.debut_saga),
    },
  };
}
