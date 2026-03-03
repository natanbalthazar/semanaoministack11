import { defineConfig } from 'drizzle-kit';
import path from 'path';

// Update with your config settings: configuração Drizzle por ambiente
const dbPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'test'
    ? 'src/database/test.sqlite'
    : 'src/database/db.sqlite'
);

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
