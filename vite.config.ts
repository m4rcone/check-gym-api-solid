import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit-tests",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e-tests",
          dir: "src/http/controllers",
          environment:
            "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
        },
      },
    ],
  },
});
