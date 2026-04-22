import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { msUntilMidnightBrasilia } from "../time";

describe("time utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should calculate correct ms until midnight in Brasilia (GMT-3)", () => {
    // Set current time to 2026-04-21 20:00:00 GMT-3 (Brasilia)
    // Which is 2026-04-21 23:00:00 UTC
    const mockDate = new Date(Date.UTC(2026, 3, 21, 23, 0, 0));
    vi.setSystemTime(mockDate);

    const ms = msUntilMidnightBrasilia();

    // 4 hours until midnight Brasilia (20:00 to 00:00)
    const expectedMs = 4 * 60 * 60 * 1000;
    expect(ms).toBe(expectedMs);
  });

  it("should calculate correct ms right before midnight", () => {
    // Set current time to 2026-04-21 23:59:59 GMT-3
    // Which is 2026-04-22 02:59:59 UTC
    const mockDate = new Date(Date.UTC(2026, 3, 22, 2, 59, 59));
    vi.setSystemTime(mockDate);

    const ms = msUntilMidnightBrasilia();

    // 1 second until midnight
    expect(ms).toBe(1000);
  });
});
