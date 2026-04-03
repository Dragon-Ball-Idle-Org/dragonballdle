"use client";

import { GuessesTable } from "@/components/shared/GuessesTable";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { useTranslations } from "@/contexts/TranslationContext";
import {
  ClassicCharacter,
  compareSaga,
  compareTransformation,
  compareValue,
} from "@/types/guess";
import dynamic from "next/dynamic";

export function ClassicGuessTable({ daily }: { daily: ClassicCharacter }) {
  const { guesses, hydrated } = useGuessesContext();
  const t = useTranslations("classic");
  const tc = useTranslations("common");

  if (!hydrated || !guesses.length) {
    return null;
  }

  return (
    <GuessesTable
      headers={[
        { value: "character", label: t.table.character },
        { value: "gender", label: t.table.gender },
        { value: "race", label: t.table.race },
        { value: "affiliation", label: t.table.affiliation },
        { value: "transformation", label: t.table.transformation },
        { value: "attribute", label: t.table.attribute },
        { value: "series", label: t.table.series },
        { value: "debut_saga", label: t.table.saga },
      ]}
      guesses={guesses.map((g) => ({
        id: g.slug,
        character: {
          imgSrc: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${g.thumb_path}`,
          alt: g.name,
        },
        gender: {
          value: g.gender.name,
          status: compareValue(g.gender.slug, daily.gender.slug ?? ""),
        },
        race: {
          value: g.races.map((r) => r.name).join(", "),
          status: compareValue(
            g.races
              .sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", "),
            daily.races
              .sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              .map((a) => a.slug)
              .join(", "),
          ),
        },
        affiliation: {
          value: g.affiliations?.map((a) => a.name).join(", ") ?? tc.none,
          status: compareValue(
            g.affiliations
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? tc.none,
            daily.affiliations
              ?.sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              .map((a) => a.slug)
              .join(", ") ?? tc.none,
          ),
        },
        transformation: {
          value: g.has_transformations ? tc.yes : tc.no,
          status: compareTransformation(
            g.has_transformations,
            daily.has_transformations,
          ),
        },
        attribute: {
          value: g.attributes?.map((a) => a.name).join(", ") ?? tc.none,
          status: compareValue(
            g.attributes
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              ?.map((a) => a.slug)
              ?.join(", ") ?? tc.none,
            daily.attributes
              ?.sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              ?.map((a) => a.slug)
              ?.join(", ") ?? tc.none,
          ),
        },
        series: {
          value: g.series.name,
          status: compareValue(g.series.slug, daily.series.slug ?? ""),
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

export function ClassicGuessTableLoader({
  dailyCharacter: daily,
}: {
  dailyCharacter: ClassicCharacter;
}) {
  return <ClassicGuessTableLoaded daily={daily} />;
}
