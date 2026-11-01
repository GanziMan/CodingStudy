import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { MODEL, getClient, streamToResponse } from "@/lib/ai";
import { ASK_SYSTEM, getMessages } from "@/lib/ask";
import { jsonError } from "@/lib/http";
import { isOwner } from "@/lib/owner";

export const maxDuration = 120;

const HISTORY_LIMIT = 40;

// 주인 전용 질문 채팅. 한도 없음. 대화는 DB에 저장하고 답변은 스트리밍으로 보낸다.
export async function POST(req: Request) {
  if (!(await isOwner())) return jsonError("권한이 없어요.", 401);
  const body = (await req.json().catch(() => null)) as { conversationId?: unknown; message?: unknown } | null;
  const text = typeof body?.message === "string" ? body.message.trim() : "";
  if (!text) return jsonError("질문을 입력해 주세요.");
  if (text.length > 30_000) return jsonError("질문이 너무 길어요. 3만 자 이하로 줄여주세요.");

  let anthropic;
  try {
    anthropic = getClient();
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "AI 설정 오류", 500);
  }

  let conversationId = Number(body?.conversationId);
  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    const title = text.replace(/\s+/g, " ").slice(0, 40);
    const [row] = await db.insert(conversations).values({ title }).returning({ id: conversations.id });
    conversationId = row.id;
  }

  await db.insert(messages).values({ conversationId, role: "user", content: text });
  const history = (await getMessages(conversationId)).slice(-HISTORY_LIMIT);

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    system: ASK_SYSTEM,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  let full = "";
  return streamToResponse(stream, {
    onText: (t) => {
      full += t;
    },
    onDone: async () => {
      if (!full.trim()) return;
      await db.insert(messages).values({ conversationId, role: "assistant", content: full });
      await db
        .update(conversations)
        .set({ updatedAt: sql`(unixepoch())` })
        .where(eq(conversations.id, conversationId));
    },
    extraHeaders: { "X-Conversation-Id": String(conversationId) },
  });
}
