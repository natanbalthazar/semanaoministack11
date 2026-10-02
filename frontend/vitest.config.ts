import { defineConfig } from "vitest/config";

// Vitest roda só os testes unitários (__tests__/). Os testes de ponta a ponta (e2e/)
// são do Playwright: se o Vitest tentar carregá-los, quebra com
// "Playwright Test did not expect test.describe() to be called here".
export default defineConfig({
  // Lê o alias "@/*" direto do tsconfig.json (recurso nativo do Vite 8).
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    // `globals: true` permite que a Testing Library limpe o DOM sozinha após cada teste.
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
