import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

import { dbConfig } from "./config";

const { url, authToken } = dbConfig();

const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalForDb.db ?? drizzle(createClient({ url, authToken }), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
