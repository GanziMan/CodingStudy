import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { problems, submissions, type Problem } from "@/db/schema";

export type ProblemSummary = Pick<Problem, "id" | "title" | "level" | "category" | "source"> & {
  status: "solved" | "tried" | "new";
};

export async function listProblems(): Promise<ProblemSummary[]> {
  const rows = await db
    .select({
      id: problems.id,
      title: problems.title,
      level: problems.level,
      category: problems.category,
      source: problems.source,
      solved: sql<number>`max(${submissions.passed})`,
      tries: sql<number>`count(${submissions.id})`,
    })
    .from(problems)
    .leftJoin(submissions, eq(submissions.problemId, problems.id))
    .groupBy(problems.id)
    .orderBy(problems.level, problems.id);

  return rows.map(({ solved, tries, ...p }) => ({
    ...p,
    status: solved ? "solved" : tries > 0 ? "tried" : "new",
  }));
}

export async function getProblem(id: number) {
  return db.query.problems.findFirst({ where: eq(problems.id, id) });
}

/** 클라이언트에 보내도 되는 필드만 (숨김 테스트·참조 풀이 제외) */
export function toPublic(p: Problem) {
  return {
    id: p.id,
    title: p.title,
    level: p.level,
    category: p.category,
    description: p.description,
    functionName: p.functionName,
    params: p.params,
    examples: p.examples,
    source: p.source,
    testCount: p.tests.length,
  };
}
export type PublicProblem = ReturnType<typeof toPublic>;

export async function listSubmissions(problemId?: number) {
  return db
    .select({
      id: submissions.id,
      problemId: submissions.problemId,
      title: problems.title,
      level: problems.level,
      code: submissions.code,
      passed: submissions.passed,
      passedCount: submissions.passedCount,
      totalCount: submissions.totalCount,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(problems, eq(problems.id, submissions.problemId))
    .where(problemId ? eq(submissions.problemId, problemId) : undefined)
    .orderBy(desc(submissions.id))
    .limit(200);
}
export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

export function starterCode(p: Pick<Problem, "functionName" | "params">) {
  return `function ${p.functionName}(${p.params.join(", ")}) {\n  var answer = 0;\n  return answer;\n}\n`;
}
