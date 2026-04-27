/** @vitest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import { useState, useEffect } from "react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SilhouetteGameBoard } from "@/features/silhouette/components/SilhouetteGameBoard";
import { GuessesContext } from "@/features/game-engine/contexts/GuessesContext";
import { GameContext } from "@/features/game-engine/contexts/GameContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import * as charactersService from "@/features/game-engine/services/characters";

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

vi.mock("@/contexts/TranslationContext", () => ({
  useTranslations: (ns: string) => {
    const translations: any = {
      guessForm: { submitAlt: "Submit Guess" },
      common: { searchPlaceholder: "Search...", noResults: "No results" },
      silhouetteViewer: {
        revealPercent: "Reveal: __P__%",
        guessCountOne: "1 guess",
        guessCountMany: "__C__ guesses",
        imageAltDaily: "Daily",
        imageAltRevealed: "Revealed",
        characterRevealed: "Revealed!",
      },
    };
    return translations[ns] || {};
  },
  TranslationProvider: ({ children }: any) => children,
}));

// Mock ScrambleText to avoid its internal logic/Audio
vi.mock("@/components/ui/ScrambleText", () => ({
  ScrambleText: ({ text, onScrambleEnd, animate }: any) => {

    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => onScrambleEnd?.(), 10);
        return () => clearTimeout(timer);
      }
    }, [animate, onScrambleEnd]);
    return <span>{text}</span>;
  }
}));

// Mock the complex Autocomplete field
vi.mock("@/features/silhouette/components/CapsuleCorp/CapsuleCorpAutocompleteField", () => ({
  CapsuleCorpAutocompleteField: ({ onChange, onSelect, suggestions }: any) => (
    <div>
      <input
        placeholder="Search character..."
        onChange={(e) => onChange(e.target.value)}
      />
      {suggestions.map((s: any) => (
        <button key={s.id} onClick={() => onSelect(s.id)}>{s.name}</button>
      ))}
    </div>
  )
}));

// Mock the image viewer to verify guessCount
vi.mock("@/features/silhouette/components/SilhouetteImageViewer", () => ({
  SilhouetteImageViewer: ({ guessCount }: { guessCount: number }) => (
    <div data-testid="image-viewer">Guesses: {guessCount}</div>
  ),
}));

const mockDailyCharacter = {
  slug: "goku",
  name: "Goku",
  thumb_path: "/goku.png",
} as any;

vi.mock("@/features/game-engine/hooks/useCharacterSearch", () => ({
  useCharacterSearch: (query: string) => {
    if (query === "veg") {
      return { results: [{ slug: "vegeta", name: "Vegeta", thumb_path: "/vegeta.png" }], isLoading: false };
    }
    if (query === "goku") {
      return { results: [{ slug: "goku", name: "Goku", thumb_path: "/goku.png" }], isLoading: false };
    }
    return { results: [], isLoading: false };
  }
}));

describe("SilhouetteGameBoard Integration", () => {
  let mockAddGuess: any;
  let mockWonGame: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddGuess = vi.fn();
    mockWonGame = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should handle a full game flow: incorrect guess, then winning guess", async () => {
    const user = userEvent.setup();

    // Use a stateful wrapper to handle guesses update correctly within the test
    const TestWrapper = () => {
      const [guesses, setGuesses] = useState<any[]>([]);
      return (
        <TranslationProvider translations={{} as any}>
          <GameContext.Provider value={{ isGameWon: false, wonGame: mockWonGame } as any}>
            <GuessesContext.Provider value={{
              guesses,
              addGuess: (g: any) => {
                setGuesses(prev => [...prev, g]);
                mockAddGuess(g);
              },
              hydrated: true
            } as any}>
              <SilhouetteGameBoard dailyCharacter={mockDailyCharacter} />
            </GuessesContext.Provider>
          </GameContext.Provider>
        </TranslationProvider>
      );
    };

    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("Search character...");
    const submitBtn = screen.getByAltText("Submit Guess");

    expect(screen.getByTestId("image-viewer")).toHaveTextContent("Guesses: 0");

    // 1. INCORRECT GUESS (Vegeta)
    vi.mocked(charactersService.getCharacterBySlug).mockResolvedValueOnce({
      slug: "vegeta",
      name: "Vegeta",
      thumb_path: "/vegeta.png",
    } as any);

    await user.type(input, "veg");
    await user.click(await screen.findByText("Vegeta"));
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId("image-viewer")).toHaveTextContent("Guesses: 1");
    });
    expect(screen.getByText("Vegeta")).toBeInTheDocument();

    // 2. WINNING GUESS (Goku)
    vi.mocked(charactersService.getCharacterBySlug).mockResolvedValueOnce(mockDailyCharacter);

    await user.clear(input);
    await user.type(input, "goku");
    await user.click(await screen.findByText("Goku"));
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId("image-viewer")).toHaveTextContent("Guesses: 2");
    });

    // Scramble animation is mocked to finish immediately in our ScrambleText mock
    await waitFor(() => {
      expect(mockWonGame).toHaveBeenCalled();
    });
  });

  it("should initialize correctly from hydrated guesses", async () => {
    const existingGuesses = [
      { slug: "vegeta", name: "Vegeta", thumb_path: "/vegeta.png" }
    ];

    render(
      <TranslationProvider translations={{} as any}>
        <GameContext.Provider value={{ isGameWon: false, wonGame: mockWonGame } as any}>
          <GuessesContext.Provider value={{
            guesses: existingGuesses,
            addGuess: mockAddGuess,
            hydrated: true
          } as any}>
            <SilhouetteGameBoard dailyCharacter={mockDailyCharacter} />
          </GuessesContext.Provider>
        </GameContext.Provider>
      </TranslationProvider>
    );

    expect(screen.getByTestId("image-viewer")).toHaveTextContent("Guesses: 1");
    expect(screen.getByText("Vegeta")).toBeInTheDocument();
  });
});
