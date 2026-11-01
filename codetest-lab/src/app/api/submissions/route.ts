import { z } from "zod";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { jsonError } from "@/lib/http";
import { getProblem } from "@/lib/problems";
import { consume } from "@/lib/rate-limit";
import { getClientIp, getUserId } from "@/lib/user";

const Body = z.object({
  problemId: z.number().int(),
  code: z.string().min(1).max(50_000),
  passedCount: z.number().int().min(0),
  totalCount: z.number().int().min(1),
});

// 채점은 브라우저에서 하고, 서버는 결과만 기록한다
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return jsonError("쿠키가 꺼져 있으면 기록을 저장할 수 없어요.", 400);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("잘못된 요청입니다.");
  const { problemId, code, passedCount, totalCount } = parsed.data;

  const problem = await getProblem(problemId);
  if (!problem) return jsonError("문제를 찾을 수 없습니다.", 404);
  // 기록 저장 폭주(DB 채우기) 방지. 채점 자체는 브라우저에서 하므로 제한에 걸려도 결과는 볼 수 있다.
  const limited = await consume(await getClientIp(), "submit");
  if (limited) return jsonError(limited, 429);
  if (totalCount !== problem.tests.length || passedCount > totalCount) {
    return jsonError("채점 결과가 올바르지 않아요. 새로고침 후 다시 제출해 주세요.");
  }

  const [saved] = await db
    .insert(submissions)
    .values({ problemId, userId, code, passedCount, totalCount, passed: passedCount === totalCount })
    .returning();
  return Response.json({ submission: saved });
}
