import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// 로컬: file:./data/app.db / 배포: Turso (libsql://...) + DATABASE_AUTH_TOKEN
const url = process.env.DATABASE_URL || "file:./data/app.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalForDb.db ?? drizzle(createClient({ url, authToken }), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
