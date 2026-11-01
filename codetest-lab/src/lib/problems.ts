import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { problems, submissions, type Problem } from "@/db/schema";

export type ProblemSummary = Pick<Problem, "id" | "title" | "level" | "category" | "source"> & {
  status: "solved" | "tried" | "new";
};

export async function listProblems(userId: string | null): Promise<ProblemSummary[]> {
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
    .leftJoin(
      submissions,
      and(eq(submissions.problemId, problems.id), eq(submissions.userId, userId ?? "")),
    )
    .groupBy(problems.id)
    .orderBy(problems.level, problems.id);

  return rows.map(({ solved, tries, ...p }) => ({
    ...p,
    status: solved ? "solved" : tries > 0 ? "tried" : "new",
  }));
}

export async function listProblemIndex() {
  return db
    .select({ id: problems.id, title: problems.title, createdAt: problems.createdAt })
    .from(problems)
    .orderBy(problems.id);
}

export async function getProblem(id: number) {
  if (!Number.isInteger(id)) return undefined;
  return db.query.problems.findFirst({ where: eq(problems.id, id) });
}

/** 브라우저로 보내는 필드 (참조 정답 코드 제외). 채점을 브라우저에서 하므로 테스트는 포함 */
export function toPublic(p: Problem, userId: string | null, siteOwner = false) {
  return {
    id: p.id,
    title: p.title,
    level: p.level,
    category: p.category,
    description: p.description,
    functionName: p.functionName,
    params: p.params,
    examples: p.examples,
    tests: p.tests,
    source: p.source,
    isMine: p.source === "ai" && (siteOwner || (!!userId && p.createdBy === userId)),
  };
}
export type PublicProblem = ReturnType<typeof toPublic>;

export async function listSubmissions(userId: string | null, problemId?: number, opts: { withCode?: boolean } = {}) {
  if (!userId) return [];
  return db
    .select({
      id: submissions.id,
      problemId: submissions.problemId,
      title: problems.title,
      level: problems.level,
      // 목록 화면에서는 코드를 내려보내지 않는다 (최대 200건 × 50KB)
      code: opts.withCode ? submissions.code : sql<string>`''`,
      passed: submissions.passed,
      passedCount: submissions.passedCount,
      totalCount: submissions.totalCount,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(problems, eq(problems.id, submissions.problemId))
    .where(
      problemId
        ? and(eq(submissions.userId, userId), eq(submissions.problemId, problemId))
        : eq(submissions.userId, userId),
    )
    .orderBy(desc(submissions.id))
    .limit(200);
}
export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

export function starterCode(p: Pick<Problem, "functionName" | "params">) {
  return `function ${p.functionName}(${p.params.join(", ")}) {\n  var answer = 0;\n  return answer;\n}\n`;
}

/** 마크다운을 걷어낸 짧은 요약 (메타 description용) */
export function plainSummary(md: string, max = 150) {
  const text = md
    .split(/\n#{1,6}\s/)[0]
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/[#>*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
