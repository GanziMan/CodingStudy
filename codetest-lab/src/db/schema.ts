import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type TestCase = { input: unknown[]; output: unknown };

export const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  level: integer("level").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  functionName: text("function_name").notNull().default("solution"),
  params: text("params", { mode: "json" }).$type<string[]>().notNull(),
  // 문제 화면에 공개되는 입출력 예
  examples: text("examples", { mode: "json" }).$type<TestCase[]>().notNull(),
  // 제출 시 채점하는 전체 테스트 (공개 예 포함)
  tests: text("tests", { mode: "json" }).$type<TestCase[]>().notNull(),
  referenceSolution: text("reference_solution"),
  source: text("source", { enum: ["seed", "ai"] }).notNull().default("seed"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  passed: integer("passed", { mode: "boolean" }).notNull(),
  passedCount: integer("passed_count").notNull(),
  totalCount: integer("total_count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Problem = typeof problems.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
