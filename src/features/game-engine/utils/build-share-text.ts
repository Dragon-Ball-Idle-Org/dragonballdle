import { GuessStatus } from "@/features/game-engine/types/guess";

type GuessRow<T extends string> = Record<T, { status?: GuessStatus }> & {
  id: string;
};

type BuildShareTextParams<T extends string> = {
  tries: number;
  headers: { value: T }[];
  guesses: GuessRow<T>[];
  translations?: Record<string, string>;
};

export function buildShareText<T extends string>({
  tries,
  headers,
  guesses,
  translations,
}: BuildShareTextParams<T>) {
  const one =
    translations?.["share.silhouette.one"] ??
    translations?.["share.tweet.one"] ??
    "I guessed today's DragonBallDle character in 1 try:\n[guesses]\nTry it too at [url]";

  const other =
    translations?.["share.silhouette.other"] ??
    translations?.["share.tweet.other"] ??
    "I guessed today's DragonBallDle character in [tries] tries:\n[guesses]\nTry it too at [url]";

  let emojis = "";

  if (guesses.length > 0) {
    emojis = guesses
      .slice(0, 6)
      .map((guess) => {
        return headers
          .map((header) => {
            const cell = guess[header.value];

            if (!cell || !("status" in cell)) return "";

            switch (cell.status) {
              case GuessStatus.CORRECT:
                return "🟩";
              case GuessStatus.PARTIAL:
                return "🟧";
              case GuessStatus.OLDEST:
                return "⬇️";
              case GuessStatus.NEWEST:
                return "⬆️";
              default:
                return "🟥";
            }
          })
          .join("");
      })
      .join("\n");

    const extraTries = guesses.length - 6;

    if (extraTries > 0) {
      const numberEmojis = [
        "0️⃣",
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
      ];

      const extraEmoji =
        extraTries <= 10
          ? numberEmojis[extraTries]
          : extraTries
              .toString()
              .split("")
              .map((d) => numberEmojis[parseInt(d, 10)])
              .join("");

      emojis += "\n➕" + extraEmoji;
    }
  }

  const template = tries === 1 ? one : other;

  return template
    .replace("[tries]", String(tries))
    .replace("[guesses]", emojis)
    .replace("[url]", "https://dragonballdle.site");
}
