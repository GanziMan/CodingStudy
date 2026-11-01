import { createHash } from "node:crypto";

/**
 * 숨은 테스트의 기대값은 브라우저로 그대로 보내지 않고 해시만 보낸다.
 * (개발자 도구로 답을 베끼는 것을 막는 용도. 정수·문자열·배열 결과에 적용)
 */
export type PublicTest = { input: unknown[]; output?: unknown; hash?: string };

/** 서버·브라우저가 똑같이 쓰는 정규화. client-grader.ts의 canonical과 반드시 같아야 한다 */
export function canonical(v: unknown): string {
  return JSON.stringify(v, (_, x) => (typeof x === "bigint" ? String(x) : x)) ?? "undefined";
}

const hasFloat = (v: unknown): boolean => {
  if (typeof v === "number") return !Number.isInteger(v);
  if (Array.isArray(v)) return v.some(hasFloat);
  if (v && typeof v === "object") return Object.values(v).some(hasFloat);
  return false;
};

export function hashOutput(problemId: number, output: unknown) {
  return createHash("sha256").update(`ctl:${problemId}:${canonical(output)}`).digest("hex");
}

/** 소수점 결과는 오차 비교가 필요해서 해시를 쓰지 않고 그대로 보낸다 */
export function hideOutput(problemId: number, t: { input: unknown[]; output: unknown }): PublicTest {
  if (hasFloat(t.output)) return t;
  return { input: t.input, hash: hashOutput(problemId, t.output) };
}
