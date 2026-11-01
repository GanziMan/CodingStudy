import type { TestResult } from "@/lib/grader";
import type { SubmissionRow } from "@/lib/problems";

export type GradeResult = TestResult & { hidden?: boolean };

export type RunOutcome =
  | { mode: "run"; results: GradeResult[] }
  | { mode: "submit"; results: GradeResult[] }
  | { mode: "error"; message: string };

export type ClientSubmission = Omit<SubmissionRow, "createdAt"> & { createdAt: string };

export type AiEntry = {
  id: number;
  title: string;
  text: string;
  pending: boolean;
  code?: string; // AI 풀이 코드
  verified?: string; // AI 풀이 검증 결과
};

export async function streamText(
  url: string,
  body: unknown,
  onChunk: (full: string) => void,
): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({ error: `요청 실패 (${res.status})` }));
    throw new Error(err.error ?? `요청 실패 (${res.status})`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk(full);
  }
  return full;
}

export const fmtArgs = (input: unknown[]) => input.map((v) => JSON.stringify(v)).join(", ");
