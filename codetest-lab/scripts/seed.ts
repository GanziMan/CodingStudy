import { loadEnvConfig } from "@next/env";

// .env.local 의 DATABASE_URL(Turso 등)을 읽은 뒤 DB 모듈을 불러온다
loadEnvConfig(process.cwd());

async function main() {
  const { db } = await import("../src/db");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("migrations: ok");
  const { problems } = await import("../src/db/schema");
  const { computeOutputs } = await import("../src/lib/grader");
  const { seedProblems } = await import("./seed-data");
  const { dbConfig } = await import("../src/db/config");
  console.log(`DB: ${dbConfig().url.replace(/\?.*$/, "")}`);

  const existing = await db.select({ title: problems.title }).from(problems);
  const titles = new Set(existing.map((p) => p.title));

  for (const p of seedProblems) {
    if (titles.has(p.title)) {
      console.log(`- 건너뜀 (이미 있음): ${p.title}`);
      continue;
    }
    const examples = await computeOutputs(p.reference, "solution", p.exampleInputs);
    const hidden = await computeOutputs(p.reference, "solution", p.hiddenInputs);
    await db.insert(problems).values({
      title: p.title,
      level: p.level,
      category: p.category,
      description: p.description,
      params: p.params,
      examples,
      tests: [...examples, ...hidden],
      referenceSolution: p.reference,
      source: "seed",
    });
    console.log(`+ 추가: ${p.title}`);
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
