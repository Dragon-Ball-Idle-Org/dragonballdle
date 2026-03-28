"use client";

import Image from "next/image";
import { MartialArtsAutocompleteField } from "./MartialArtsAutocompleteField";
import { SyntheticEvent } from "react";

export function MartialArtsGuessForm() {
  const submitGuess = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <form
      className="sticky top-0 left-0 right-0 w-full flex items-center gap-2 mb-2 bg-transparent overflow-visible z-2"
      onSubmit={(e) => submitGuess(e)}
    >
      <MartialArtsAutocompleteField
        className="w-full"
        suggestions={[
          {
            id: "goku",
            name: "Goku",
            image: "https://cdn.dragonballdle.site/characters/thumbs/goku.png",
          },
          {
            id: "vegeta",
            name: "Vegeta",
            image:
              "https://cdn.dragonballdle.site/characters/thumbs/vegeta.png",
          },
        ]}
      />
      <button
        type="submit"
        className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <Image
          src="/assets/dragon_ball_4_stars.svg"
          alt="4 Starts Dragon Ball"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </button>
    </form>
  );
}
