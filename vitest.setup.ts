import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => {
  return {
    useTranslations: () => (key: string) => key,
    useLocale: () => "en-US",
  };
});

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
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
      })),
    })),
  };
});
