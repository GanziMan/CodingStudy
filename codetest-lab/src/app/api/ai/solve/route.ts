import { callTool, problemContext } from "@/lib/ai";
import { aiProblem } from "@/lib/ai-route";
import { runTests } from "@/lib/grader";

type Solved = { code: string; explanation: string };

// AI가 직접 풀고, 그 코드를 전체 테스트로 검증해서 함께 돌려준다
export async function POST(req: Request) {
  const r = await aiProblem(req);
  if ("error" in r) return r.error;
  const p = r.problem;

  return r.run(async () => {
    const solved = await callTool<Solved>({
      prompt: `${problemContext(p)}

이 문제를 JavaScript로 풀어주세요.
- 함수명·매개변수는 시그니처 그대로: function ${p.functionName}(${p.params.join(", ")})
- 학습자가 읽고 배울 수 있게, 핵심 줄에 짧은 한국어 주석
- 재귀 깊이가 커질 수 있으면 반복문(Bottom-up) 사용
- explanation: 풀이 흐름을 마크다운으로 짧게 (dp 정의·점화식·초기값 등)`,
      toolName: "submit_solution",
      description: "문제 풀이 코드와 설명을 제출",
      schema: {
        type: "object",
        properties: {
          code: { type: "string", description: "완성된 JavaScript 코드" },
          explanation: { type: "string", description: "풀이 설명 (마크다운)" },
        },
        required: ["code", "explanation"],
      },
    });

    const results = await runTests(solved.code, p.functionName, p.tests);
    const passedCount = results.filter((x) => x.passed).length;
    return Response.json({ ...solved, passedCount, totalCount: results.length });
  });
}
