import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  // AI 문제를 만든 익명 사용자 ID (삭제 권한 확인용)
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  // 로그인 없이 쓰도록 브라우저 쿠키의 익명 ID로 기록을 구분
  userId: text("user_id").notNull(),
  code: text("code").notNull(),
  passed: integer("passed", { mode: "boolean" }).notNull(),
  passedCount: integer("passed_count").notNull(),
  totalCount: integer("total_count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}, (t) => [index("submissions_user_idx").on(t.userId, t.problemId)]);

// AI 호출 일일 사용량 (key = "ip:<ip>" | "global", kind = "ai" | "generate")
export const aiUsage = sqliteTable(
  "ai_usage",
  {
    key: text("key").notNull(),
    kind: text("kind").notNull(),
    day: text("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.key, t.kind, t.day] })],
);

export type Problem = typeof problems.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
