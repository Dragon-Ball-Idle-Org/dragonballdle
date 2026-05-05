import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],

    // Performance optimizations
    pool: "threads",

    // Faster test execution
    testTimeout: 10000,
    hookTimeout: 5000,

    // Reduce unnecessary operations
    isolate: false,
    clearMocks: true,
    restoreMocks: true,

    // Better reporting
    reporters: ["default"],
    outputFile: "./test-results/junit.xml",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  // Build optimizations
  esbuild: {
    target: "node18",
  },
});
