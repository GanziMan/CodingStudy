import { z } from "zod";
import { db } from "@/db";
import { problems } from "@/db/schema";
import { callTool } from "@/lib/ai";
import { computeOutputs } from "@/lib/grader";
import { CATEGORIES } from "@/lib/categories";
import { jsonError } from "@/lib/http";
import { isOwner } from "@/lib/owner";
import { getUserId } from "@/lib/user";

export const maxDuration = 180;

const Body = z.object({
  category: z.enum(CATEGORIES),
  level: z.number().int().min(1).max(5),
  request: z.string().max(200).optional(),
});

const Generated = z
  .object({
    title: z.string().min(1).max(60),
    description: z.string().min(20),
    params: z.array(z.string().regex(/^[A-Za-z_$][\w$]*$/)).min(1).max(5),
    exampleInputs: z.array(z.array(z.unknown())).min(1).max(4),
    hiddenInputs: z.array(z.array(z.unknown())).min(3).max(15),
    reference: z.string().min(10),
  })
  .refine(
    (g) => [...g.exampleInputs, ...g.hiddenInputs].every((i) => i.length === g.params.length),
    "모든 입력의 인자 개수가 params와 같아야 합니다.",
  );
type Generated = z.infer<typeof Generated>;

const SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string", description: "한국어 문제 제목 (짧게)" },
    description: {
      type: "string",
      description:
        "프로그래머스 스타일 마크다운 본문: 문제 설명 → '### 제한사항' → '### 입출력 예 설명'. 입출력 예 표는 넣지 말 것(자동 생성됨). 함수명은 solution.",
    },
    params: { type: "array", items: { type: "string" }, description: "solution 함수의 매개변수 이름들" },
    exampleInputs: {
      type: "array",
      items: { type: "array" },
      description: "공개 입출력 예의 입력 2~3개. 각 원소는 인자 배열. 예: [[5,[3]],[6,[4]]]",
    },
    hiddenInputs: {
      type: "array",
      items: { type: "array" },
      description:
        "숨김 테스트 입력 6~10개. 경계값(최소/빈 배열 등)과 함정 케이스 포함. JSON이 커지지 않게 배열 길이는 50 이하.",
    },
    reference: {
      type: "string",
      description: "정답 참조 풀이. 'function solution(...) { ... }' 형태의 순수 JS. 출력값은 이 코드로 계산됨.",
    },
  },
  required: ["title", "description", "params", "exampleInputs", "hiddenInputs", "reference"],
};

export async function POST(req: Request) {
  if (!(await isOwner())) return jsonError("AI 기능은 지금 사용할 수 없어요.", 403);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("유형·레벨을 확인하세요.");
  const { category, level, request } = parsed.data;
  const userId = await getUserId();
  if (!userId) return jsonError("쿠키가 꺼져 있으면 문제를 만들 수 없어요.");

  const existing = await db.select({ title: problems.title }).from(problems);
  const prompt = `새 코딩테스트 문제를 하나 만들어주세요.
- 유형: ${category}
- 난이도: 프로그래머스 Lv.${level} 수준
- 언어: JavaScript, 함수명 solution
- 기존 문제와 겹치지 않게: ${existing.map((e) => e.title).join(", ")}
${request ? `- 추가 요청: ${request}` : ""}
문제는 독창적으로(기존 사이트 문제를 그대로 베끼지 말 것) 만들고, 정답이 하나로 정해지게 하세요. 출력이 매우 큰 수가 되면 1,000,000,007로 나눈 나머지를 요구하세요.`;

  try {
    let gen: Generated | null = null;
    let lastError = "";
    for (let attempt = 0; attempt < 2 && !gen; attempt++) {
      const raw = await callTool<unknown>({
        prompt: lastError
          ? `${prompt}\n\n이전 시도가 검증에 실패했습니다: ${lastError}\n고쳐서 다시 만들어주세요.`
          : prompt,
        toolName: "create_problem",
        description: "코딩테스트 문제 생성",
        schema: SCHEMA,
      });
      const g = Generated.safeParse(raw);
      if (!g.success) {
        lastError = g.error.issues.map((i) => i.message).join("; ");
        continue;
      }
      try {
        const examples = await computeOutputs(g.data.reference, "solution", g.data.exampleInputs);
        const hidden = await computeOutputs(g.data.reference, "solution", g.data.hiddenInputs);
        gen = g.data;
        const [row] = await db
          .insert(problems)
          .values({
            title: gen.title,
            level,
            category,
            description: gen.description,
            params: gen.params,
            examples,
            tests: [...examples, ...hidden],
            referenceSolution: gen.reference,
            source: "ai",
            createdBy: userId,
          })
          .returning({ id: problems.id });
        return Response.json({ id: row.id });
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
      }
    }
    console.error("generate failed:", lastError);
    return jsonError("문제를 검증하지 못했어요. 다른 유형이나 요청으로 다시 시도해 주세요.", 502);
  } catch (e) {
    console.error(e);
    return jsonError("AI 응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.", 500);
  }
}
