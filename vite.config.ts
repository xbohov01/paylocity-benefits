/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/testSetup.ts"],
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude ?? [],
        "**/mock",
        "**/components/ui",
        "**/api",
        "**/tests"
      ]
    }
  },
});
