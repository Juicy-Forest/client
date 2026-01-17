import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: [
        "node_modules/",
        "src/routes/**",
        "src/lib/utils/**",
        "src/lib/stores/**",
        "src/lib/components/UI/**",
        "src/lib/types/**",
        "src/**/*.{test,spec}.{js,ts}",
        "**/*.config.{js,ts}",
        ".svelte-kit/",
        "build/",
        "dist/",
        "vitest-setup.ts",
        "static/",
        ".vscode/",
        "coverage/",
      ],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
  resolve: {
    conditions: ["browser"],
  },
});
