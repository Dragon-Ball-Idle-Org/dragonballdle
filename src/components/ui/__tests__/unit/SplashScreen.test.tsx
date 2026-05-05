import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SplashScreen } from "../../SplashScreen";

describe("SplashScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should render the loading image initially", () => {
    render(<SplashScreen />);

    const loadingImg = screen.getByAltText("Loading...");
    expect(loadingImg).toBeInTheDocument();

    // Ensure the container has opacity-100 initially (loaded state is false by default)
    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-100");
    expect(container).not.toHaveClass("opacity-0");
  });

  it("should fade out when page is loaded", () => {
    // Mock document.readyState as "loading" initially
    Object.defineProperty(document, "readyState", {
      value: "loading",
      configurable: true,
    });

    render(<SplashScreen />);

    // Initially should be visible
    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-100");
    expect(container).not.toHaveClass("opacity-0");

    // Simulate page load event
    act(() => {
      window.dispatchEvent(new Event("load"));
    });

    // Should fade out after load
    expect(container).toHaveClass("opacity-0");
    expect(container).toHaveClass("pointer-events-none");
  });

  it("SplashScreen stateful component handles complete readyState", () => {
    // Mock document.readyState as "complete"
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });

    render(<SplashScreen />);

    // Initially should be visible (timeout hasn't fired yet)
    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-100");
    expect(container).not.toHaveClass("opacity-0");

    // Fast forward the setTimeout(handleLoad, 100)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should fade out after timeout
    expect(container).toHaveClass("opacity-0");
  });
});
