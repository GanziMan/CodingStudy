import Anthropic from "@anthropic-ai/sdk";
import type { Problem } from "@/db/schema";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5";

let client: Anthropic | null = null;
export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.");
  }
  client ??= new Anthropic();
  return client;
}

const TONE = `당신은 JavaScript 코딩테스트(프로그래머스 스타일)를 가르치는 한국어 튜터입니다.
- 학습자는 실무 개발자지만 알고리즘(특히 DP)은 배우는 중입니다.
- 답변은 핵심만 짧게. 군더더기 인사·반복 설명 금지. 마크다운 사용.
- 개념 설명은 작은 예시 값으로 직접 따라가 보이는 방식이 효과적입니다.`;

export function problemContext(p: Problem, opts: { withReference?: boolean } = {}) {
  const ex = p.examples
    .map((t) => `- ${p.functionName}(${t.input.map((v) => JSON.stringify(v)).join(", ")}) → ${JSON.stringify(t.output)}`)
    .join("\n");
  let s = `# 문제: ${p.title} (Lv.${p.level}, ${p.category})

${p.description}

## 함수 시그니처
function ${p.functionName}(${p.params.join(", ")})

## 입출력 예
${ex}`;
  if (opts.withReference && p.referenceSolution) {
    s += `\n\n## 참조 정답 코드 (학습자에게 그대로 노출하지 말고 참고만)\n\`\`\`js\n${p.referenceSolution}\n\`\`\``;
  }
  return s;
}

export type TextTask =
  | { kind: "hint"; level: 1 | 2 | 3; code?: string }
  | { kind: "explain" }
  | { kind: "review"; code: string; resultSummary?: string };

function buildTextPrompt(p: Problem, task: TextTask) {
  switch (task.kind) {
    case "hint": {
      const depth = {
        1: "방향만 잡아주는 아주 가벼운 힌트 1~2문장 (어떤 유형인지, 무엇을 정의해야 하는지).",
        2: "dp 정의(또는 핵심 자료구조)와 점화식의 모양까지 알려주되, 초기값과 코드는 숨기세요.",
        3: "점화식·초기값·반복 범위까지 구체적으로. 단, 완성 코드는 쓰지 마세요.",
      }[task.level];
      return `${problemContext(p, { withReference: true })}

학습자가 힌트 ${task.level}단계를 요청했습니다. ${depth}
${task.code ? `\n학습자의 현재 코드:\n\`\`\`js\n${task.code}\n\`\`\`\n코드가 의미 있게 작성됐다면 그 방향에 맞춰 힌트를 주세요.` : ""}`;
    }
    case "explain":
      return `${problemContext(p, { withReference: true })}

이 문제의 해설을 써주세요. 구성:
1. **핵심 아이디어** (2~3문장)
2. **풀이 설계** — DP라면 dp[i] 정의 / 점화식 / 초기값 / 반복 범위. 다른 유형이면 그에 맞는 핵심 단계.
3. **작은 예시로 따라가기** — 입출력 예 하나로 값이 채워지는 과정
4. **정답 코드** (JS, 주석 간단히)
5. **시간·공간 복잡도**
6. **자주 하는 실수** 1~3개`;
    case "review":
      return `${problemContext(p, { withReference: true })}

학습자 코드:
\`\`\`js
${task.code}
\`\`\`
${task.resultSummary ? `\n최근 채점 결과: ${task.resultSummary}\n` : ""}
이 코드를 리뷰해주세요. 형식:
- **문제점**: 무엇이 왜 틀렸는지 (줄/표현을 짚어서)
- **해결 방법**: 어떻게 고치면 되는지 (필요한 부분만 짧은 코드 조각으로, 전체 정답 코드는 주지 말 것)
코드가 이미 맞다면 그렇게 말하고, 더 나은 점(복잡도·가독성)만 짧게 짚어주세요.`;
  }
}

/** 텍스트 응답을 스트리밍으로 돌려주는 Response */
export function streamText(p: Problem, task: TextTask): Response {
  const anthropic = getClient();
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    system: TONE,
    messages: [{ role: "user", content: buildTextPrompt(p, task) }],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (t) => controller.enqueue(encoder.encode(t)));
      stream.on("end", () => controller.close());
      stream.on("error", (e) => {
        controller.enqueue(encoder.encode(`\n\n> ⚠️ AI 응답 오류: ${e.message}`));
        controller.close();
      });
    },
    cancel() {
      stream.abort();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

/** tool_use로 구조화된 JSON을 받는다 */
export async function callTool<T>(opts: {
  prompt: string | Anthropic.MessageParam[];
  toolName: string;
  description: string;
  schema: Anthropic.Tool.InputSchema;
  maxTokens?: number;
}): Promise<T> {
  const anthropic = getClient();
  const messages: Anthropic.MessageParam[] =
    typeof opts.prompt === "string" ? [{ role: "user", content: opts.prompt }] : [...opts.prompt];
  // 일부 모델은 tool_choice로 특정 도구를 강제할 수 없어서(400 에러), auto로 두고 지시문으로 호출을 유도한다.
  // 도구를 부르지 않으면 한 번 더 요청한다.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 16000,
      system: `${TONE}\n\n이번 요청에는 반드시 ${opts.toolName} 도구를 한 번 호출해서 답하세요. 도구 밖에 다른 텍스트는 쓰지 마세요.`,
      tools: [{ name: opts.toolName, description: opts.description, input_schema: opts.schema }],
      tool_choice: { type: "auto" },
      messages,
    });
    const block = res.content.find((b) => b.type === "tool_use" && b.name === opts.toolName);
    if (block && block.type === "tool_use") return block.input as T;
    messages.push(
      { role: "assistant", content: res.content.length ? res.content : "(응답 없음)" },
      { role: "user", content: `${opts.toolName} 도구를 호출해서 결과를 제출해 주세요.` },
    );
  }
  throw new Error("AI가 구조화된 응답을 주지 않았습니다.");
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** 문제 화면의 자유 질문. 문제·현재 코드·최근 채점 결과를 맥락으로 대화한다. */
export function streamProblemChat(
  p: Problem,
  opts: { history: ChatTurn[]; message: string; code?: string; resultSummary?: string },
): Response {
  const anthropic = getClient();
  const context = `${problemContext(p, { withReference: true })}

## 학습자의 현재 에디터 코드
\`\`\`js
${opts.code?.trim() || "(아직 작성 안 함)"}
\`\`\`
${opts.resultSummary ? `\n## 최근 실행 결과\n${opts.resultSummary}\n` : ""}
학습자가 이 문제를 풀면서 질문합니다. 학습자가 정답을 직접 요구하기 전에는 정답 코드 전체를 주지 말고, 질문한 부분만 정확히 답하세요.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: context },
    { role: "assistant", content: "네, 문제와 코드를 확인했어요. 무엇이 궁금한가요?" },
    ...opts.history.slice(-20).map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: opts.message },
  ];

  const stream = anthropic.messages.stream({ model: MODEL, max_tokens: 6000, system: TONE, messages });
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (t) => controller.enqueue(encoder.encode(t)));
      stream.on("end", () => controller.close());
      stream.on("error", (e) => {
        controller.enqueue(encoder.encode(`\n\n> 답변이 중간에 끊겼어요: ${e.message}`));
        controller.close();
      });
    },
    cancel() {
      stream.abort();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
