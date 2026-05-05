import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClassicGameBoard } from "@/features/classic/components/ClassicGameBoard";
import { GuessesContext } from "@/features/game-engine/contexts/GuessesContext";
import { GameContext } from "@/features/game-engine/contexts/GameContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

// Performance: Use inline mocks to avoid hoisting issues
vi.mock("@/features/game-engine/services/characters", () => ({
  getCharacterBySlug: vi.fn(),
}));

vi.mock("@/features/game-engine/services/wins", () => ({
  incrementWins: vi.fn(),
}));

vi.mock("@/features/game-engine/services/leaderboard", () => ({
  recordGuess: vi.fn(),
}));

vi.mock("@/utils/mobile-behaviors", () => ({
  hideKeyboard: vi.fn(),
}));

const mockDailyCharacter = {
  slug: "goku",
  name: "Goku",
  thumb_path: "/goku.png",
} as any;

const mockTranslations = {
  guessForm: {
    submitAlt: "Submit Guess",
    placeholder: "Search character...",
  },
  common: {
    searchPlaceholder: "Search...",
    noResults: "No results found",
  },
};

describe("ClassicGameBoard Integration", () => {
  let mockAddGuess: any;
  let mockWonGame: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddGuess = vi.fn().mockReturnValue(1);
    mockWonGame = vi.fn();

    // Performance: Simplified fetch mock
    global.fetch = vi.fn().mockImplementation((url: string) => {
      const query = new URL(url, "http://localhost").searchParams
        .get("q")
        ?.toLowerCase();
      const results = query
        ? [
            { slug: "vegeta", name: "Vegeta", thumb_path: "/vegeta.png" },
            { slug: "goku", name: "Goku", thumb_path: "/goku.png" },
          ].filter((r) => r.name.toLowerCase().includes(query))
        : [];
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(results),
      });
    });
  });

  it("should handle a full game flow: search, incorrect guess, then winning guess", async () => {
    // Performance: Faster userEvent setup
    const user = userEvent.setup({ delay: null });
    render(
      <TranslationProvider translations={mockTranslations as any}>
        <GameContext.Provider
          value={{ isGameWon: false, wonGame: mockWonGame } as any}
        >
          <GuessesContext.Provider
            value={
              { guesses: [], addGuess: mockAddGuess, hydrated: true } as any
            }
          >
            <ClassicGameBoard dailyCharacter={mockDailyCharacter} />
          </GuessesContext.Provider>
        </GameContext.Provider>
      </TranslationProvider>,
    );

    const input = screen.getByPlaceholderText("Search...");
    const submitBtn = screen.getByAltText("Submit Guess");

    // 1. INCORRECT GUESS (Vegeta)
    const { getCharacterBySlug } =
      await import("@/features/game-engine/services/characters");
    vi.mocked(getCharacterBySlug).mockResolvedValueOnce({
      slug: "vegeta",
      name: "Vegeta",
    } as any);

    await user.type(input, "veg");
    const vegSuggestion = await screen.findByText(
      "Vegeta",
      {},
      { timeout: 1000 },
    );
    await user.click(vegSuggestion);
    await user.click(submitBtn);

    await waitFor(
      () => {
        expect(mockAddGuess).toHaveBeenCalledWith(
          expect.objectContaining({ slug: "vegeta" }),
        );
      },
      { timeout: 1000 },
    );

    // 2. WINNING GUESS (Goku)
    const { getCharacterBySlug: getCharacterBySlug2 } =
      await import("@/features/game-engine/services/characters");
    vi.mocked(getCharacterBySlug2).mockResolvedValueOnce(mockDailyCharacter);

    await user.clear(input);
    await user.type(input, "goku");
    const gokuSuggestion = await screen.findByText(
      "Goku",
      {},
      { timeout: 1000 },
    );
    await user.click(gokuSuggestion);
    await user.click(submitBtn);

    await waitFor(
      () => {
        expect(mockAddGuess).toHaveBeenCalledWith(
          expect.objectContaining({ slug: "goku" }),
        );
      },
      { timeout: 1000 },
    );

    // 3. VERIFY WIN
    await waitFor(() => expect(mockWonGame).toHaveBeenCalled(), {
      timeout: 1000,
    });
  }, 8000); // Performance: Further reduced test timeout
});
