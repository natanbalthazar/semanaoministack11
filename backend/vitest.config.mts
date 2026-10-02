import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Todos os testes de integração usam o MESMO arquivo src/database/test.sqlite.
    // Rodando os arquivos em paralelo, um limpa as tabelas enquanto o outro escreve → "SQLITE_BUSY: database is locked".
    fileParallelism: false,
  },
});
