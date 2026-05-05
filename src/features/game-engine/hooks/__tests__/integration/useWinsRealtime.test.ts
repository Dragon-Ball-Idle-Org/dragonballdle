import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWinsRealtime } from "@/features/game-engine/hooks/useWinsRealtime";
import * as winsService from "@/features/game-engine/services/wins";

vi.mock("@/features/game-engine/services/wins", () => ({
  getWinsCount: vi.fn(),
}));

describe("useWinsRealtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize and fetch the current wins count", async () => {
    vi.mocked(winsService.getWinsCount).mockResolvedValue(42);

    const { result } = renderHook(() => useWinsRealtime("classic"));

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Performance: Fast waitFor with reduced timeout
    await vi.waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 500 },
    );

    expect(result.current.winsCount).toBe(42);
    expect(winsService.getWinsCount).toHaveBeenCalledWith("classic");
  });
});
