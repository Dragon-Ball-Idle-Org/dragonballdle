import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import { vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => {
  return {
    useTranslations: () => (key: string) => key,
    useLocale: () => "en-US",
  };
});

// Fast-forward game win timeout
const originalSetTimeout = global.setTimeout;
(global as any).setTimeout = (cb: any, ms: number) => {
  if (ms === 2700) return originalSetTimeout(cb, 0);
  return originalSetTimeout(cb, ms);
};

// Mock next/navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    notFound: vi.fn(),
  };
});

// Mock next-intl navigation wrappers
vi.mock("@/i18n/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => "/",
    Link: "a",
  };
});

// Mock Supabase
vi.mock("@supabase/ssr", () => {
  return {
    createBrowserClient: vi.fn(() => ({
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
    })),
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  load: vi.fn(),
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
})) as any;

if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.HTMLMediaElement.prototype.load = vi.fn();
}

// Disable framer-motion animations
vi.mock("framer-motion", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    motion: new Proxy(actual.motion, {
      get: (_target, key: string) => {
        if (key === "custom") return actual.motion.custom;
        return (props: any) => {
          const { layout, ...rest } = props;
          return <div {...rest} data-framer-key={key} />;
        };
      },
    }),
    AnimatePresence: ({ children }: any) => children,
  };
});

