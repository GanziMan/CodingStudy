import { streamText } from "@/lib/ai";
import { aiProblem } from "@/lib/ai-route";
import { jsonError } from "@/lib/http";

export async function POST(req: Request) {
  const r = await aiProblem(req);
  if ("error" in r) return r.error;
  const code = typeof r.body.code === "string" ? r.body.code.trim() : "";
  if (!code) return jsonError("리뷰할 코드가 없습니다.");
  const resultSummary = typeof r.body.resultSummary === "string" ? r.body.resultSummary : undefined;
  return r.run(() => streamText(r.problem, { kind: "review", code, resultSummary }));
}
