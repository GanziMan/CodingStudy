// 로컬: file:./data/app.db
// 배포: DATABASE_URL/DATABASE_AUTH_TOKEN 또는 Vercel의 Turso 연동이 넣어주는 TURSO_DATABASE_URL/TURSO_AUTH_TOKEN
export function dbConfig() {
  const url =
    process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./data/app.db";
  const authToken =
    process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined;
  return { url, authToken };
}
