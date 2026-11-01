import { eq } from "drizzle-orm";
import { db } from "@/db";
import { problems, submissions } from "@/db/schema";
import { jsonError, problemFromParams } from "@/lib/http";

// AI가 만든 문제만 삭제 가능
export async function DELETE(_req: Request, ctx: RouteContext<"/api/problems/[id]">) {
  const problem = await problemFromParams(ctx.params);
  if (!problem) return jsonError("문제를 찾을 수 없습니다.", 404);
  if (problem.source !== "ai") return jsonError("기본 문제는 삭제할 수 없습니다.", 403);
  await db.delete(submissions).where(eq(submissions.problemId, problem.id));
  await db.delete(problems).where(eq(problems.id, problem.id));
  return Response.json({ ok: true });
}
