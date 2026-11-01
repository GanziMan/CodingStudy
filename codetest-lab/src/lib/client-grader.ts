"use client";

import type { TestCase } from "@/db/schema";

export type TestResult = {
  index: number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string | null;
  error: string | null;
  logs: string[];
  timeMs: number;
  hidden?: boolean;
};

const TIMEOUT_MS = 3000;

// 사용자 코드는 서버가 아니라 브라우저의 Web Worker에서만 실행한다.
// 테스트마다 새 Worker를 띄워 무한 루프는 terminate()로 끊는다.
const WORKER_SOURCE = `
const fmt = (v) => {
  if (typeof v === "bigint") return v.toString() + "n";
  if (typeof v === "string") return JSON.stringify(v);
  if (v === undefined) return "undefined";
  if (typeof v === "function") return "[Function]";
  try {
    return JSON.stringify(v, (_, x) => (typeof x === "bigint" ? x.toString() + "n" : x));
  } catch { return String(v); }
};
const show = (v) => (typeof v === "string" ? v : fmt(v));
const eq = (a, b) => {
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return a === b || Math.abs(a - b) < 1e-9;
  }
  if (typeof a === "bigint" || typeof b === "bigint") {
    try { return BigInt(a) === BigInt(b); } catch { return false; }
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => eq(a[k], b[k]));
};
self.onmessage = (e) => {
  const { code, functionName, input, output } = e.data;
  const logs = [];
  const push = (...args) => { if (logs.length < 50) logs.push(args.map(show).join(" ")); };
  self.console = { log: push, info: push, warn: push, error: push, debug: push };
  const start = performance.now();
  try {
    const fn = new Function(code + "\\n;return typeof " + functionName + " === 'function' ? " + functionName + " : undefined;")();
    if (typeof fn !== "function") throw new Error(functionName + " 함수가 없어요. 함수 이름을 바꾸지 않았는지 확인해 보세요.");
    const actual = fn(...input);
    const timeMs = performance.now() - start;
    if (actual && typeof actual.then === "function") throw new Error("async 함수가 아닌 일반 함수로 값을 return 해주세요.");
    self.postMessage({ passed: eq(actual, output), actual: fmt(actual), error: null, logs, timeMs });
  } catch (err) {
    let msg = err && err.message ? err.message : String(err);
    if (/call stack/i.test(msg)) msg = "스택 오버플로: 재귀가 너무 깊어요. 반복문(Bottom-up)으로 바꿔보세요.";
    else if (err && err.name && err.name !== "Error") msg = err.name + ": " + msg;
    self.postMessage({ passed: false, actual: null, error: msg, logs, timeMs: performance.now() - start });
  }
};
`;

let workerUrl: string | null = null;
function getWorkerUrl() {
  workerUrl ??= URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  return workerUrl;
}

const fmt = (v: unknown) => (typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v));

function runOne(code: string, functionName: string, t: TestCase, index: number): Promise<TestResult> {
  const base = { index, input: t.input.map(fmt).join(", "), expected: fmt(t.output) };
  return new Promise((resolve) => {
    const worker = new Worker(getWorkerUrl());
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        ...base,
        passed: false,
        actual: null,
        error: `시간 초과 (${TIMEOUT_MS / 1000}초). 무한 루프가 있거나 더 빠른 방법이 필요해요.`,
        logs: [],
        timeMs: TIMEOUT_MS,
      });
    }, TIMEOUT_MS);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ...base, ...e.data });
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      e.preventDefault();
      resolve({ ...base, passed: false, actual: null, error: `문법 오류: ${e.message}`, logs: [], timeMs: 0 });
    };
    worker.postMessage({ code, functionName, input: t.input, output: t.output });
  });
}

export async function runTests(code: string, functionName: string, tests: TestCase[]) {
  const results: TestResult[] = [];
  for (let i = 0; i < tests.length; i++) results.push(await runOne(code, functionName, tests[i], i));
  return results;
}
