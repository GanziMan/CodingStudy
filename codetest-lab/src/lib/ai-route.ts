import type { Problem } from "@/db/schema";
import { getProblem } from "./problems";
import { jsonError } from "./http";

type Ok = {
  problem: Problem;
  body: Record<string, unknown>;
  run: (fn: () => Response | Promise<Response>) => Promise<Response>;
};

/** AI 라우트 공통: body에서 problemId를 읽고, 실행 중 에러를 JSON으로 변환 */
export async function aiProblem(req: Request): Promise<Ok | { error: Response }> {
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const problem = await getProblem(Number(body.problemId));
  if (!problem) return { error: jsonError("문제를 찾을 수 없습니다.", 404) };
  return {
    problem,
    body,
    run: async (fn) => {
      try {
        return await fn();
      } catch (e) {
        return jsonError(e instanceof Error ? e.message : "AI 요청 실패", 500);
      }
    },
  };
}
