"use client";

import { GuessesTable } from "@/components/shared/GuessesTable";
import { useGuesses } from "@/hooks/useGuesses";
import { compareSaga, compareValue } from "@/types/guess";
import { useLocale } from "next-intl";

export function ClassicGuessTable({ dayIndex }: { dayIndex: number }) {
  const locale = useLocale();
  const { guesses } = useGuesses(dayIndex, locale);

  const daily = {
    slug: "goku",
    name: "Goku",
    gender: {
      name: "Male",
      slug: "male",
    },
    race: [
      {
        name: "Saiyan",
        slug: "saiyan",
      },
    ],
    series: {
      name: "Dragon Ball Z",
      slug: "dragon-ball-z",
    },
    debut_saga: {
      name: "Saiyan Saga",
      slug: "saiyan-saga",
      sort_order: 100,
    },
  }; //await getDailyCharacter(dayIndex, locale);

  return (
    <GuessesTable
      headers={["character", "name", "gender", "race", "series", "debut_saga"]}
      guesses={guesses.map((g) => ({
        character: {
          imgSrc: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${g.thumb_path}`,
          alt: g.name,
        },
        name: { value: g.name, status: compareValue(g.slug, daily.slug) },
        gender: {
          value: g.gender.name,
          status: compareValue(g.gender.slug, daily.gender.slug),
        },
        race: {
          value: g.race[0].name,
          status: compareValue(g.race[0].slug, daily.race[0].slug),
        },
        series: {
          value: g.series.name,
          status: compareValue(g.series.slug, daily.series.slug),
        },
        debut_saga: {
          value: g.debut_saga.name,
          status: compareSaga(g.debut_saga, daily.debut_saga),
        },
      }))}
    />
  );
}
