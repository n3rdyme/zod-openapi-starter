/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";

export default defineConfig({
  // plugins: [react()], // import react from '@vitejs/plugin-react-swc'
  test: {
    // css: true,
    globals: true,
    restoreMocks: true,
    environment: "node",
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["json", "html"],
      exclude: [
        "node_modules/**",
        "coverage/**",
        "dist/**",
        "generated/**",
        "test/**",
        "__tests__/**",
        "**/[.]**",
        "**/*.d.ts",
        "**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
      ],
    },
    // https://github.com/vitest-dev/vitest/issues/1674
    ...(process.env.CI && {
      minThreads: 4,
      maxThreads: 4,
    }),
  },
});
