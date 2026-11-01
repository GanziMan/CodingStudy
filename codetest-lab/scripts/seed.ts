import { db } from "../src/db";
import { problems } from "../src/db/schema";
import { computeOutputs } from "../src/lib/grader";
import { seedProblems } from "./seed-data";

async function main() {
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
