import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/db/config";

loadEnvConfig(process.cwd());

const { url, authToken } = dbConfig();
const isTurso = url.startsWith("libsql://");

export default defineConfig(
  isTurso
    ? {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "turso",
        dbCredentials: { url, authToken },
      }
    : {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "sqlite",
        dbCredentials: { url },
      },
);
