
// Load .env then .env.local (override) so Prisma CLI matches Next.js / npm run dev.
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config();
config({ path: ".env.local", override: true });

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
