import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClassicGameBoard } from "../../ClassicGameBoard";
import { GuessesContext } from "@/contexts/GuessesContext";
import { GameContext } from "@/contexts/GameContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import * as charactersService from "@/service/characters";

// Mocking external services
vi.mock("@/service/characters", () => ({
  getCharacterBySlug: vi.fn(),
}));

vi.mock("@/service/wins", () => ({
  incrementWins: vi.fn(),
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
  }
};

describe("ClassicGameBoard Integration", () => {
  let mockAddGuess: any;
  let mockWonGame: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddGuess = vi.fn();
    mockWonGame = vi.fn();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      const query = new URL(url, "http://localhost").searchParams.get("q")?.toLowerCase();
      const allResults = [
        { slug: "vegeta", name: "Vegeta", thumb_path: "/vegeta.png" },
        { slug: "goku", name: "Goku", thumb_path: "/goku.png" },
      ];
      const filtered = query ? allResults.filter(r => r.name.toLowerCase().includes(query)) : [];
      return Promise.resolve({ ok: true, json: () => Promise.resolve(filtered) });
    });
  });

  it("should handle a full game flow: search, incorrect guess, then winning guess", async () => {
    const user = userEvent.setup();
    render(
      <TranslationProvider translations={mockTranslations as any}>
        <GameContext.Provider value={{ isGameWon: false, wonGame: mockWonGame } as any}>
          <GuessesContext.Provider value={{ guesses: [], addGuess: mockAddGuess, hydrated: true } as any}>
            <ClassicGameBoard dailyCharacter={mockDailyCharacter} />
          </GuessesContext.Provider>
        </GameContext.Provider>
      </TranslationProvider>
    );

    const input = screen.getByPlaceholderText("Search...");
    const submitBtn = screen.getByAltText("Submit Guess");

    // 1. INCORRECT GUESS (Vegeta)
    await user.type(input, "veg");
    const vegSuggestion = await screen.findByText("Vegeta", {}, { timeout: 5000 });
    await user.click(vegSuggestion);
    
    vi.mocked(charactersService.getCharacterBySlug).mockResolvedValueOnce({
      slug: "vegeta",
      name: "Vegeta",
    } as any);

    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockAddGuess).toHaveBeenCalledWith(expect.objectContaining({ slug: "vegeta" }));
    });

    // 2. WINNING GUESS (Goku)
    // Clear input first (the component should do this, but let's be sure)
    await user.clear(input);
    await user.type(input, "goku");
    const gokuSuggestion = await screen.findByText("Goku", {}, { timeout: 5000 });
    await user.click(gokuSuggestion);

    vi.mocked(charactersService.getCharacterBySlug).mockResolvedValueOnce(mockDailyCharacter);

    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockAddGuess).toHaveBeenCalledWith(expect.objectContaining({ slug: "goku" }));
    });

    // 3. VERIFY WIN
    await waitFor(() => expect(mockWonGame).toHaveBeenCalled(), { timeout: 5000 });
  }, 15000);
});
