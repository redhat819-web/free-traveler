import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const env = loadEnv("test", process.cwd(), "");
for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value;
}

export default defineConfig({
  test: {
    include: [
      "tests/unit/**/*.{test,spec}.ts",
      "tests/rls/**/*.{test,spec}.ts",
      "src/**/*.{test,spec}.ts",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
    passWithNoTests: true,
  },
});
