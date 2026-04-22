import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SplashScreen, SplashScreenUI } from "../../SplashScreen";

describe("SplashScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the loading image initially", () => {
    render(<SplashScreenUI loaded={false} />);
    
    const loadingImg = screen.getByAltText("Loading...");
    expect(loadingImg).toBeInTheDocument();
    
    // Ensure the container does not have opacity-0 when not loaded
    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-100");
    expect(container).not.toHaveClass("opacity-0");
  });

  it("should fade out when loaded is true", () => {
    render(<SplashScreenUI loaded={true} />);
    
    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-0");
    expect(container).toHaveClass("pointer-events-none");
  });

  it("SplashScreen stateful component handles load event", () => {
    // Mock document.readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });

    render(<SplashScreen />);
    
    // Fast forward the setTimeout(handleLoad, 0)
    act(() => {
      vi.runAllTimers();
    });

    const container = document.getElementById("app-loading");
    expect(container).toHaveClass("opacity-0");
  });
});
