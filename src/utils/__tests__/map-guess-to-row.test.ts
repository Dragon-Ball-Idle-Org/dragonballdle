import { describe, it, expect } from "vitest";
import { mapGuessToRow } from "../map-guess-to-row";
import { CharacterGuess, GuessStatus } from "@/types/guess";

const mockCharacter = (overrides: Partial<CharacterGuess>): CharacterGuess => ({
  slug: "goku",
  name: "Goku",
  thumb_path: "",
  gender: { slug: "male", name: "Male" },
  races: [{ slug: "saiyan", name: "Saiyan" }],
  affiliations: [{ slug: "z-fighter", name: "Z Fighter" }],
  has_transformations: true,
  attributes: [{ slug: "strength", name: "Strength" }],
  series: { slug: "dragon-ball-z", name: "Dragon Ball Z" },
  debut_saga: { slug: "saiyan-saga", name: "Saiyan Saga", sort_order: 5 },
  ...overrides,
});

describe("mapGuessToRow", () => {
  it("should return CORRECT for all fields if guess is identical to answer", () => {
    const answer = mockCharacter({});
    const guess = mockCharacter({});

    const result = mapGuessToRow(guess, answer);

    expect(result.gender.status).toBe(GuessStatus.CORRECT);
    expect(result.race.status).toBe(GuessStatus.CORRECT);
    expect(result.affiliation.status).toBe(GuessStatus.CORRECT);
    expect(result.transformation.status).toBe(GuessStatus.CORRECT);
    expect(result.attribute.status).toBe(GuessStatus.CORRECT);
    expect(result.series.status).toBe(GuessStatus.CORRECT);
    expect(result.debut_saga.status).toBe(GuessStatus.CORRECT);
  });

  it("should return WRONG for fields that completely mismatch", () => {
    const answer = mockCharacter({});
    const guess = mockCharacter({
      gender: { slug: "female", name: "Female" },
      has_transformations: false,
      series: { slug: "dragon-ball-gt", name: "Dragon Ball GT" },
    });

    const result = mapGuessToRow(guess, answer);

    expect(result.gender.status).toBe(GuessStatus.WRONG);
    expect(result.transformation.status).toBe(GuessStatus.WRONG);
    expect(result.series.status).toBe(GuessStatus.WRONG);
  });

  it("should return PARTIAL for array fields where at least one element matches", () => {
    const answer = mockCharacter({
      races: [
        { slug: "saiyan", name: "Saiyan" },
        { slug: "earthling", name: "Earthling" },
      ],
    });
    const guess = mockCharacter({
      races: [
        { slug: "saiyan", name: "Saiyan" },
        { slug: "namekian", name: "Namekian" },
      ],
    });

    const result = mapGuessToRow(guess, answer);

    expect(result.race.status).toBe(GuessStatus.PARTIAL);
  });

  it("should return WRONG for array fields where no elements match", () => {
    const answer = mockCharacter({
      races: [{ slug: "saiyan", name: "Saiyan" }],
    });
    const guess = mockCharacter({
      races: [{ slug: "namekian", name: "Namekian" }],
    });

    const result = mapGuessToRow(guess, answer);

    expect(result.race.status).toBe(GuessStatus.WRONG);
  });
});
