import { runTests } from "@/lib/grader";
import { jsonError, problemFromParams, readCode } from "@/lib/http";

// 공개된 입출력 예로만 실행 (기록 저장 안 함)
export async function POST(req: Request, ctx: RouteContext<"/api/problems/[id]/run">) {
  const problem = await problemFromParams(ctx.params);
  if (!problem) return jsonError("문제를 찾을 수 없습니다.", 404);
  const code = await readCode(req);
  if (code === null) return jsonError("코드가 비어 있거나 너무 깁니다.");

  try {
    const results = await runTests(code, problem.functionName, problem.examples);
    return Response.json({ results });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "실행 실패", 500);
  }
}
