import { CharacterGuess, ClassicCharacter } from "@/types/guess";

export function compareGuess(guessed: CharacterGuess, daily: ClassicCharacter) {
  return {
    correct: guessed.slug === daily.slug,
    thumb_src: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${daily.thumb_path}`,
  };
}
