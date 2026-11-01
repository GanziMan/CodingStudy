export const maxDuration = 120;

import { streamProblemChat, type ChatTurn } from "@/lib/ai";
import { aiProblem } from "@/lib/ai-route";
import { jsonError } from "@/lib/http";

export async function POST(req: Request) {
  const r = await aiProblem(req);
  if ("error" in r) return r.error;
  const message = typeof r.body.message === "string" ? r.body.message.trim() : "";
  if (!message) return jsonError("질문을 입력해 주세요.");
  const history = (Array.isArray(r.body.history) ? r.body.history : [])
    .filter(
      (t): t is ChatTurn =>
        !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.length > 0,
    )
    .map((t) => ({ role: t.role, content: t.content.slice(0, 30_000) }));
  return r.run(() =>
    streamProblemChat(r.problem, {
      history,
      message,
      code: typeof r.body.code === "string" ? r.body.code : undefined,
      resultSummary: typeof r.body.resultSummary === "string" ? r.body.resultSummary : undefined,
    }),
  );
}
