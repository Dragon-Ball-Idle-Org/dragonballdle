import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import requireParseBodyForLocale from "./eslint-rules/require-parse-body-for-locale.js";

const apiRules = {
  plugins: {
    local: {
      rules: {
        "require-parse-body-for-locale": requireParseBodyForLocale,
      },
    },
  },
  rules: {
    "local/require-parse-body-for-locale": "error",
  },
  files: ["src/app/api/**/*.ts"],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  apiRules,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    ignores: ["supabase/functions/**"],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "tests/e2e/**/*.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "vitest.setup.tsx",
    ],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
