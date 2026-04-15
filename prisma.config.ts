
// Load .env lalu .env.local; pertahankan DATABASE_URL dari lingkungan (Docker/CI).
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

const databaseUrlFromEnv = process.env.DATABASE_URL;
config();
config({ path: ".env.local", override: true });
if (databaseUrlFromEnv) {
  process.env.DATABASE_URL = databaseUrlFromEnv;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
