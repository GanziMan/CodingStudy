import { db } from "@/db";
import { submissions } from "@/db/schema";
import { runTests } from "@/lib/grader";
import { jsonError, problemFromParams, readCode } from "@/lib/http";

// 전체 테스트로 채점하고 기록 저장. 숨김 테스트는 입력·출력을 가린다.
export async function POST(req: Request, ctx: RouteContext<"/api/problems/[id]/submit">) {
  const problem = await problemFromParams(ctx.params);
  if (!problem) return jsonError("문제를 찾을 수 없습니다.", 404);
  const code = await readCode(req);
  if (code === null) return jsonError("코드가 비어 있거나 너무 깁니다.");

  let results;
  try {
    results = await runTests(code, problem.functionName, problem.tests);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "채점 실패", 500);
  }

  const exampleCount = problem.examples.length;
  const masked = results.map((r) =>
    r.index < exampleCount
      ? { ...r, hidden: false }
      : {
          ...r,
          hidden: true,
          input: "",
          expected: "",
          actual: null,
          logs: [],
          error: r.error && /시간 초과|스택/.test(r.error) ? r.error : r.error ? "런타임 에러" : null,
        },
  );

  const passedCount = results.filter((r) => r.passed).length;
  const [saved] = await db
    .insert(submissions)
    .values({
      problemId: problem.id,
      code,
      passed: passedCount === results.length,
      passedCount,
      totalCount: results.length,
    })
    .returning();

  return Response.json({ results: masked, submission: saved });
}
