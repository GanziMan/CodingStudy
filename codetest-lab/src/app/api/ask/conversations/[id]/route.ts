import { eq } from "drizzle-orm";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { jsonError } from "@/lib/http";
import { isOwner } from "@/lib/owner";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/ask/conversations/[id]">) {
  if (!(await isOwner())) return jsonError("권한이 없어요.", 401);
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return jsonError("잘못된 요청이에요.");
  await db.delete(messages).where(eq(messages.conversationId, id));
  await db.delete(conversations).where(eq(conversations.id, id));
  return Response.json({ ok: true });
}
