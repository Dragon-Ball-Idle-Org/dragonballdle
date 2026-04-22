import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWinsRealtime } from "../../useWinsRealtime";
import * as winsService from "@/service/wins";

vi.mock("@/service/wins", () => ({
  getWinsCount: vi.fn(),
}));

describe("useWinsRealtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize and fetch the current wins count", async () => {
    vi.mocked(winsService.getWinsCount).mockResolvedValue(42);

    const { result, rerender } = renderHook(() => useWinsRealtime("classic"));

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the async effect to settle. Since we mock the promise, 
    // we need to wait for a tick.
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.winsCount).toBe(42);
    expect(winsService.getWinsCount).toHaveBeenCalledWith("classic");
  });
});
