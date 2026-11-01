import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "file:./data/app.db";

const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalForDb.db ?? drizzle(createClient({ url }), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
