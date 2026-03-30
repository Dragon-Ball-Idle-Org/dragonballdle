"use client";

import { GuessesTable } from "@/components/shared/GuessesTable";
import { useGuessesContext } from "@/contexts/GuessesContext";
import {
  compareSaga,
  compareTransformation,
  compareValue,
} from "@/types/guess";
import dynamic from "next/dynamic";

export function ClassicGuessTable() {
  const { guesses, hydrated } = useGuessesContext();

  if (!hydrated || !guesses.length) {
    return null;
  }

  const daily = {
    slug: "goku",
    name: "Goku",
    gender: {
      name: "Male",
      slug: "male",
    },
    races: [
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
      sort_order: 800,
    },
    affiliations: [
      {
        name: "Z Fighters",
        slug: "z-fighters",
      },
    ],
    attributes: [
      {
        name: "Power",
        slug: "power",
      },
      {
        name: "Martial Arts",
        slug: "martial-arts",
      },
    ],
    has_transformations: true,
  }; //await getDailyCharacter(dayIndex, locale);

  return (
    <GuessesTable
      headers={[
        { value: "character", label: "Character" },
        { value: "gender", label: "Gender" },
        { value: "race", label: "Race" },
        { value: "affiliation", label: "Affiliation" },
        { value: "transformation", label: "Transformation" },
        { value: "attribute", label: "Attribute" },
        { value: "series", label: "Series" },
        { value: "debut_saga", label: "Saga" },
      ]}
      guesses={guesses.map((g) => ({
        id: g.slug,
        character: {
          imgSrc: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${g.thumb_path}`,
          alt: g.name,
        },
        gender: {
          value: g.gender.name,
          status: compareValue(g.gender.slug, daily.gender.slug),
        },
        race: {
          value: g.races.map((r) => r.name).join(", "),
          status: compareValue(
            g.races
              .sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", "),
            daily.races
              .sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", "),
          ),
        },
        affiliation: {
          value: g.affiliations?.map((a) => a.name).join(", ") ?? "None",
          status: compareValue(
            g.affiliations
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? "None",
            daily.affiliations
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? "None",
          ),
        },
        transformation: {
          value: g.has_transformations ? "Yes" : "No",
          status: compareTransformation(
            g.has_transformations,
            daily.has_transformations,
          ),
        },
        attribute: {
          value: g.attributes?.map((a) => a.name).join(", ") ?? "None",
          status: compareValue(
            g.attributes
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              ?.map((a) => a.slug)
              ?.join(", ") ?? "None",
            daily.attributes
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              ?.map((a) => a.slug)
              ?.join(", ") ?? "None",
          ),
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

const ClassicGuessTableLoaded = dynamic(
  () =>
    import("./ClassicGuessTable").then((m) => ({
      default: m.ClassicGuessTable,
    })),
  { ssr: false },
);

export function ClassicGuessTableLoader() {
  return <ClassicGuessTableLoaded />;
}
