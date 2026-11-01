import { eq } from "drizzle-orm";
import { db } from "@/db";
import { problems, submissions } from "@/db/schema";
import { jsonError, problemFromParams } from "@/lib/http";
import { getUserId } from "@/lib/user";

// AI 문제는 만든 사람(또는 ADMIN_TOKEN 보유자)만 삭제
export async function DELETE(req: Request, ctx: RouteContext<"/api/problems/[id]">) {
  const problem = await problemFromParams(ctx.params);
  if (!problem) return jsonError("문제를 찾을 수 없습니다.", 404);

  const admin = process.env.ADMIN_TOKEN;
  const isAdmin = !!admin && req.headers.get("x-admin-token") === admin;
  const isOwner = problem.source === "ai" && !!problem.createdBy && problem.createdBy === (await getUserId());
  if (!isAdmin && !isOwner) return jsonError("직접 만든 AI 문제만 삭제할 수 있어요.", 403);

  await db.delete(submissions).where(eq(submissions.problemId, problem.id));
  await db.delete(problems).where(eq(problems.id, problem.id));
  return Response.json({ ok: true });
}
