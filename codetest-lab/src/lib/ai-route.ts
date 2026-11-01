import type { Problem } from "@/db/schema";
import { getProblem } from "./problems";
import { jsonError } from "./http";
import { consume } from "./rate-limit";
import { getClientIp } from "./user";

type Ok = {
  problem: Problem;
  body: Record<string, unknown>;
  run: (fn: () => Response | Promise<Response>) => Promise<Response>;
};

/** AI 라우트 공통: problemId 확인 → 일일 한도 차감 → 실행 중 에러를 JSON으로 변환 */
export async function aiProblem(req: Request): Promise<Ok | { error: Response }> {
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const problem = await getProblem(Number(body.problemId));
  if (!problem) return { error: jsonError("문제를 찾을 수 없습니다.", 404) };
  for (const k of ["code", "resultSummary"]) {
    if (typeof body[k] === "string" && (body[k] as string).length > 20_000) {
      return { error: jsonError("코드가 너무 길어요. 2만 자 이하로 줄여주세요.") };
    }
  }
  return {
    problem,
    body,
    run: async (fn) => {
      const limited = await consume(await getClientIp(), "ai");
      if (limited) return jsonError(limited, 429);
      try {
        return await fn();
      } catch (e) {
        console.error(e);
        return jsonError("AI 응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.", 500);
      }
    },
  };
}
