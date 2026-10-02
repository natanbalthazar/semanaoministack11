// ESLint em "flat config" (formato padrão desde o ESLint 9).
// O Next 16 removeu o `next lint`: agora o lint roda direto pelo CLI (`pnpm lint` → `eslint .`)
// e o `next build` NÃO roda mais o lint — rode `pnpm lint` você mesmo (ou no CI).
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**", // saída antiga do Create React App
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
