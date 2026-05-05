import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import { vi } from "vitest";

// Performance: Cache expensive mocks
const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
});

const createMockSupabaseClient = () => ({
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  removeChannel: vi.fn(),
  rpc: vi.fn().mockReturnThis(),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  })),
});

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en-US",
}));

// Performance: Aggressive timeout fast-forwarding
const originalSetTimeout = global.setTimeout;
vi.stubGlobal("setTimeout", (cb: TimerHandler, ms?: number) => {
  // Fast-forward all common timeouts
  if (ms === 2700 || ms === 100 || ms === 200 || ms === 300 || ms === 500)
    return originalSetTimeout(cb, 0);
  // Reduce other timeouts significantly
  if (ms && ms > 1000) return originalSetTimeout(cb, 100);
  return originalSetTimeout(cb, ms);
});

// Performance: Fast-forward setInterval too
const originalSetInterval = global.setInterval;
vi.stubGlobal("setInterval", (cb: TimerHandler, ms?: number) => {
  if (ms && ms > 100) return originalSetInterval(cb, 10);
  return originalSetInterval(cb, ms);
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: createMockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Mock next-intl navigation wrappers
vi.mock("@/i18n/navigation", () => ({
  useRouter: createMockRouter,
  usePathname: () => "/",
  Link: "a",
}));

// Mock Supabase
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(createMockSupabaseClient),
}));

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" {...props} />
  ),
}));

// Performance: Simplified Audio mock
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  load: vi.fn(),
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
};

global.Audio = vi.fn(() => mockAudio) as unknown as typeof Audio;

if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.HTMLMediaElement.prototype.load = vi.fn();
}

// Performance: Optimized framer-motion mock
vi.mock("framer-motion", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  const motionDiv = (props: { children?: React.ReactNode }) => {
    const { children, ...rest } = props;
    return <div {...rest}>{children}</div>;
  };

  return {
    ...actual,
    motion: {
      div: motionDiv,
      span: motionDiv,
      button: motionDiv,
      // Add more as needed
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});
