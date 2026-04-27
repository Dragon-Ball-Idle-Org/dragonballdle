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
import { TranslationNamespace, createT } from "@/lib/client-translations";
import dynamic from "next/dynamic";

export function ClassicGuessTable({
  dailyCharacter,
}: {
  dailyCharacter: ClassicCharacter;
}) {
  const { guesses, hydrated } = useGuessesContext();
  const t = createT(useTranslations("classic") as TranslationNamespace);
  const tc = createT(useTranslations("common") as TranslationNamespace);

  if (!hydrated || !guesses.length) {
    return null;
  }

  return (
    <GuessesTable
      headers={[
        { value: "character", label: t("table.character") },
        { value: "gender", label: t("table.gender") },
        { value: "race", label: t("table.race") },
        { value: "affiliation", label: t("table.affiliation") },
        { value: "transformation", label: t("table.transformation") },
        { value: "attribute", label: t("table.attribute") },
        { value: "series", label: t("table.series") },
        { value: "debut_saga", label: t("table.saga") },
      ]}
      guesses={guesses.map((g) => ({
        id: g.slug,
        character: {
          imgSrc: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}${g.thumb_path}`,
          alt: g.name,
        },
        gender: {
          value: g.gender.name,
          status: compareValue(g.gender.slug, dailyCharacter.gender.slug ?? ""),
        },
        race: {
          value: g.races.map((r) => r.name).join(", "),
          status: compareValue(
            g.races
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
            dailyCharacter.races
              ?.sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
          ),
        },
        affiliation: {
          value: g.affiliations?.map((a) => a.name).join(", ") ?? tc("none"),
          status: compareValue(
            g.affiliations
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
            dailyCharacter.affiliations
              ?.sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
          ),
        },
        transformation: {
          value: g.has_transformations ? tc("yes") : tc("no"),
          status: compareTransformation(
            g.has_transformations,
            dailyCharacter.has_transformations,
          ),
        },
        attribute: {
          value: g.attributes?.map((a) => a.name).join(", ") ?? tc("none"),
          status: compareValue(
            g.attributes
              ?.sort((a, b) => a.slug.localeCompare(b.slug))
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
            dailyCharacter.attributes
              ?.sort((a, b) => a.slug?.localeCompare(b.slug ?? "") ?? 0)
              .map((a) => a.slug)
              .join(", ") ?? tc("none"),
          ),
        },
        series: {
          value: g.series?.name ?? tc("none"),
          status: compareValue(
            g.series?.slug ?? tc("none"),
            dailyCharacter.series?.slug ?? tc("none"),
          ),
        },
        debut_saga: {
          value: g.debut_saga.name,
          status: compareSaga(g.debut_saga, dailyCharacter.debut_saga),
        },
      }))}
    />
  );
}

export const ClassicGuessTableLoader = dynamic(
  () => import("./ClassicGuessTable").then((mod) => mod.ClassicGuessTable),
  { ssr: false },
);
