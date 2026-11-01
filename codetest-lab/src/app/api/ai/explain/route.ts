export const maxDuration = 60;

import { streamText } from "@/lib/ai";
import { aiProblem } from "@/lib/ai-route";

export async function POST(req: Request) {
  const r = await aiProblem(req);
  if ("error" in r) return r.error;
  return r.run(() => streamText(r.problem, { kind: "explain" }));
}
