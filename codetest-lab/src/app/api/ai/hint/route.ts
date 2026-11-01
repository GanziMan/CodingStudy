import { streamText } from "@/lib/ai";
import { aiProblem } from "@/lib/ai-route";
import { jsonError } from "@/lib/http";

export async function POST(req: Request) {
  const r = await aiProblem(req);
  if ("error" in r) return r.error;
  const level = Number(r.body.level);
  if (![1, 2, 3].includes(level)) return jsonError("힌트 단계는 1~3입니다.");
  const code = typeof r.body.code === "string" ? r.body.code : undefined;
  return r.run(() => streamText(r.problem, { kind: "hint", level: level as 1 | 2 | 3, code }));
}
