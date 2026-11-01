import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL || "file:./data/app.db";
const isTurso = url.startsWith("libsql://");

export default defineConfig(
  isTurso
    ? {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "turso",
        dbCredentials: { url, authToken: process.env.DATABASE_AUTH_TOKEN },
      }
    : {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "sqlite",
        dbCredentials: { url },
      },
);
