import { Worker } from "node:worker_threads";
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
};

const PER_TEST_TIMEOUT_MS = 2000;

// 서버에서는 시드·AI 문제 생성 시 "참조 정답 코드"로 기대 출력을 계산할 때만 쓴다.
// 사용자 코드는 서버에서 실행하지 않는다 (브라우저 client-grader 사용).
const WORKER_SOURCE = `
const { parentPort, workerData } = require("node:worker_threads");
const vm = require("node:vm");
const util = require("node:util");

const fmt = (v) => {
  if (typeof v === "bigint") return v.toString() + "n";
  if (typeof v === "string") return JSON.stringify(v);
  if (v === undefined) return "undefined";
  try {
    return JSON.stringify(v, (_, x) => (typeof x === "bigint" ? x.toString() + "n" : x));
  } catch {
    return util.inspect(v);
  }
};

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
  if (ka.length !== kb.length) return false;
  return ka.every((k) => eq(a[k], b[k]));
};

const { code, functionName, tests, timeoutMs } = workerData;
const results = [];

tests.forEach((t, index) => {
  const logs = [];
  const push = (...args) => {
    if (logs.length < 50) logs.push(args.map((a) => (typeof a === "string" ? a : util.inspect(a, { depth: 4 }))).join(" "));
  };
  const context = vm.createContext({
    console: { log: push, info: push, warn: push, error: push, debug: push },
    __args: structuredClone(t.input),
  });
  const base = { index, input: t.input.map(fmt).join(", "), expected: fmt(t.output), logs };
  const start = performance.now();
  try {
    new vm.Script(code, { filename: "solution.js" }).runInContext(context, { timeout: timeoutMs });
    const kind = new vm.Script("typeof " + functionName).runInContext(context);
    if (kind !== "function") throw new Error(functionName + " 함수가 정의되지 않았습니다.");
    const actual = new vm.Script(functionName + "(...__args)").runInContext(context, { timeout: timeoutMs });
    const timeMs = performance.now() - start;
    results.push({ ...base, passed: eq(actual, t.output), actual: fmt(actual), error: null, timeMs });
  } catch (e) {
    const timeMs = performance.now() - start;
    let msg = e && e.code === "ERR_SCRIPT_EXECUTION_TIMEOUT"
      ? "시간 초과 (" + timeoutMs + "ms)"
      : String(e && e.message ? e.message : e);
    if (/call stack/i.test(msg)) msg = "스택 오버플로: " + msg;
    results.push({ ...base, passed: false, actual: null, error: msg, timeMs });
  }
});

parentPort.postMessage(results);
`;

export function runTests(
  code: string,
  functionName: string,
  tests: TestCase[],
): Promise<TestResult[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_SOURCE, {
      eval: true,
      workerData: { code, functionName, tests, timeoutMs: PER_TEST_TIMEOUT_MS },
      resourceLimits: { maxOldGenerationSizeMb: 256 },
      // vm은 보안 샌드박스가 아니므로 워커에는 환경변수(API 키 등)를 넘기지 않는다
      env: {},
    });
    const killer = setTimeout(
      () => {
        worker.terminate();
        reject(new Error("전체 실행 시간이 초과되었습니다."));
      },
      tests.length * PER_TEST_TIMEOUT_MS + 3000,
    );
    worker.once("message", (results: TestResult[]) => {
      clearTimeout(killer);
      worker.terminate();
      resolve(results);
    });
    worker.once("error", (err) => {
      clearTimeout(killer);
      reject(err);
    });
  });
}

/** 참조 풀이로 테스트 입력의 기대 출력을 계산 (시드·AI 문제 검증용) */
export async function computeOutputs(
  reference: string,
  functionName: string,
  inputs: unknown[][],
): Promise<TestCase[]> {
  const results = await runTests(
    reference,
    functionName,
    inputs.map((input) => ({ input, output: null })),
  );
  const failed = results.find((r) => r.error);
  if (failed) throw new Error(`참조 풀이 실행 실패 (테스트 ${failed.index + 1}): ${failed.error}`);
  return results.map((r, i) => ({ input: inputs[i], output: parseActual(r.actual) }));
}

function parseActual(s: string | null): unknown {
  if (s === null || s === "undefined") return null;
  if (/^-?\d+n$/.test(s)) return s.slice(0, -1); // BigInt는 문자열로 보관
  return JSON.parse(s);
}
