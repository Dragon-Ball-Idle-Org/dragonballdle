import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGuesses } from "@/features/game-engine/hooks/useGuesses";
import * as storageUtils from "@/utils/storage";

vi.mock("@/utils/storage", () => ({
  getWithExpiry: vi.fn(),
  setWithExpiry: vi.fn(),
}));

vi.mock("@/features/game-engine/services/characters", () => ({
  getCharacterBySlug: vi.fn(),
}));

describe("useGuesses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("should initialize with empty guesses if storage is empty", async () => {
    vi.mocked(storageUtils.getWithExpiry).mockReturnValue(null);

    const { result } = renderHook(() => useGuesses("en-US", "classic"));

    expect(result.current.guesses).toEqual([]);
    // Fast path for empty slugs sets hydrated to true immediately
    expect(result.current.hydrated).toBe(true);
  });

  it("should add a new guess and save it to storage", () => {
    vi.mocked(storageUtils.getWithExpiry).mockReturnValue([]);
    const { result } = renderHook(() => useGuesses("en-US", "classic"));

    act(() => {
      result.current.addGuess({
        id: 1,
        slug: "goku",
        name: "Goku",
      } as any);
    });

    expect(result.current.guesses).toHaveLength(1);
    expect(result.current.guesses[0].slug).toBe("goku");
    expect(storageUtils.setWithExpiry).toHaveBeenCalled();
  });

  it("should not add duplicate guesses", () => {
    vi.mocked(storageUtils.getWithExpiry).mockReturnValue([]);
    const { result } = renderHook(() => useGuesses("en-US", "classic"));

    const goku = { slug: "goku", name: "Goku" } as any;

    act(() => {
      result.current.addGuess(goku);
      result.current.addGuess(goku); // Performance: Combine calls
    });

    expect(result.current.guesses).toHaveLength(1);
  });
});
