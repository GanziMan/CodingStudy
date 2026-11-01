import type { Problem } from "@/db/schema";
import { getProblem } from "./problems";
import { jsonError } from "./http";
import { isOwner } from "./owner";

type Ok = {
  problem: Problem;
  body: Record<string, unknown>;
  run: (fn: () => Response | Promise<Response>) => Promise<Response>;
};

/** AI 라우트 공통: 주인만 허용 → problemId 확인 → 실행 중 에러를 JSON으로 변환 */
export async function aiProblem(req: Request): Promise<Ok | { error: Response }> {
  // AI 기능은 악용(비용 폭탄)을 막기 위해 /ask 비밀번호로 연 주인 기기에서만 쓸 수 있다
  if (!(await isOwner())) return { error: jsonError("AI 기능은 지금 사용할 수 없어요.", 403) };
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const problem = await getProblem(Number(body.problemId));
  if (!problem) return { error: jsonError("문제를 찾을 수 없습니다.", 404) };
  for (const k of ["code", "resultSummary"]) {
    if (typeof body[k] === "string" && (body[k] as string).length > 30_000) {
      return { error: jsonError("코드가 너무 길어요. 3만 자 이하로 줄여주세요.") };
    }
  }
  return {
    problem,
    body,
    run: async (fn) => {
      try {
        return await fn();
      } catch (e) {
        console.error(e);
        return jsonError("AI 응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.", 500);
      }
    },
  };
}
