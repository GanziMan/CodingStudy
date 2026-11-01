"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { runTests } from "@/lib/client-grader";
import type { PublicProblem } from "@/lib/problems";
import { LevelBadge } from "../LevelBadge";
import { AiPane } from "./AiPane";
import { CodeEditor } from "./CodeEditor";
import { HistoryPane } from "./HistoryPane";
import { ProblemPane } from "./ProblemPane";
import { ResultPanel } from "./ResultPanel";
import type { ClientSubmission, RunOutcome } from "./types";

type Tab = "problem" | "ai" | "history";

const TIP_KEY = "ctl:tip-dismissed";
const noopSubscribe = () => () => {};

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

export function Workspace({
  problem,
  starter,
  initialSubmissions,
}: {
  problem: PublicProblem;
  starter: string;
  initialSubmissions: ClientSubmission[];
}) {
  const router = useRouter();
  const storageKey = `code:${problem.id}`;
  // 작성 중인 코드는 브라우저에 자동 저장 (에디터는 클라이언트에서만 그려져 SSR 값과 충돌 없음)
  const [code, setCode] = useState(() =>
    typeof window === "undefined" ? starter : (safeGet(storageKey) ?? starter),
  );
  // 서버 렌더링에서는 안내를 숨기고, 브라우저에서 닫은 적이 없을 때만 보여준다 (hydration 불일치 방지)
  const [tipClosed, setTipClosed] = useState(false);
  const tipSeen = useSyncExternalStore(
    noopSubscribe,
    () => !!safeGet(TIP_KEY),
    () => true,
  );
  const showTip = !tipSeen && !tipClosed;
  const setShowTip = (v: boolean) => setTipClosed(!v);
  const [tab, setTab] = useState<Tab>("problem");
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [subs, setSubs] = useState(initialSubmissions);

  useEffect(() => {
    const t = setTimeout(() => safeSet(storageKey, code), 300);
    return () => clearTimeout(t);
  }, [code, storageKey]);

  const solved = subs.some((s) => s.passed);
  const exampleCount = problem.examples.length;

  const grade = useCallback(
    async (mode: "run" | "submit") => {
      setBusy(mode);
      setOutcome(null);
      try {
        const tests = mode === "run" ? problem.examples : problem.tests;
        const raw = await runTests(code, problem.functionName, tests);
        const results = raw.map((r) =>
          r.index >= exampleCount ? { ...r, hidden: true } : r,
        );
        setOutcome({ mode, results });

        if (mode === "submit") {
          const passedCount = results.filter((r) => r.passed).length;
          const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problemId: problem.id, code, passedCount, totalCount: results.length }),
          });
          const data = await res.json();
          if (res.ok) {
            setSubs((prev) => [
              { ...data.submission, title: problem.title, level: problem.level },
              ...prev,
            ]);
            router.refresh();
          }
        }
      } catch (e) {
        setOutcome({ mode: "error", message: e instanceof Error ? e.message : String(e) });
      } finally {
        setBusy(null);
      }
    },
    [code, exampleCount, problem, router],
  );

  const resultSummary =
    outcome && outcome.mode !== "error"
      ? `${outcome.mode === "run" ? "예제 실행" : "제출"} ${outcome.results.filter((r) => r.passed).length}/${outcome.results.length} 통과` +
        outcome.results
          .filter((r) => !r.passed && !r.hidden)
          .slice(0, 3)
          .map((r) => ` | 입력 ${r.input} 기대 ${r.expected} 실제 ${r.actual ?? r.error}`)
          .join("")
      : undefined;

  const deleteProblem = async () => {
    if (!confirm("내가 만든 이 AI 문제를 삭제할까요?")) return;
    const res = await fetch(`/api/problems/${problem.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert((await res.json()).error);
    }
  };

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      aria-selected={tab === t}
      role="tab"
      className={`h-11 shrink-0 border-b-2 px-4 text-sm ${tab === t ? "border-accent text-white" : "border-transparent text-white/55 hover:text-white"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col bg-panel-2 text-white lg:h-[calc(100dvh-3.5rem)]">
      <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-panel-line bg-navy/60 px-4 py-2">
        <Link href="/problems" className="text-xs text-white/50 hover:text-white">
          ← 문제 목록
        </Link>
        <h1 className="truncate font-semibold">{problem.title}</h1>
        <LevelBadge level={problem.level} />
        <span className="text-xs text-white/50">{problem.category}</span>
        {problem.source === "ai" && <span className="text-xs text-[#b794f6]">AI 생성 문제</span>}
        {solved && <span className="text-xs font-semibold text-ok">✓ 해결</span>}
        {problem.isMine && (
          <button onClick={deleteProblem} className="ml-auto text-xs text-white/40 hover:text-bad">
            문제 삭제
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-0 flex-col border-panel-line lg:w-[44%] lg:border-r">
          <div role="tablist" className="flex shrink-0 overflow-x-auto border-b border-panel-line px-2">
            {tabBtn("problem", "문제 설명")}
            {tabBtn("ai", "AI 튜터")}
            {tabBtn("history", `내 제출 ${subs.length ? `(${subs.length})` : ""}`)}
          </div>
          <div className="max-h-[60vh] min-h-0 flex-1 overflow-y-auto lg:max-h-none">
            <div hidden={tab !== "problem"}>
              <ProblemPane problem={problem} />
            </div>
            <div hidden={tab !== "ai"} className="h-full">
              <AiPane
                problemId={problem.id}
                functionName={problem.functionName}
                tests={problem.tests}
                code={code}
                solved={solved}
                resultSummary={resultSummary}
                onUseCode={(c) => {
                  if (confirm("에디터의 코드를 AI 풀이로 바꿀까요? (지금 코드는 사라집니다)")) setCode(c);
                }}
              />
            </div>
            <div hidden={tab !== "history"}>
              <HistoryPane
                submissions={subs}
                onLoad={(c) => {
                  if (confirm("이 코드를 에디터로 불러올까요?")) setCode(c);
                }}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col border-t border-panel-line lg:min-h-0 lg:border-t-0">
          {showTip && (
            <div className="flex items-start gap-3 border-b border-panel-line bg-accent/10 px-4 py-3 text-[13px] leading-relaxed text-white/85">
              <span aria-hidden>👋</span>
              <p className="flex-1">
                <b>처음이세요?</b> <code className="text-accent">{problem.functionName}</code> 함수 안에 코드를 쓰고
                답을 <b>return</b> 하면 돼요. <b>코드 실행</b>은 예제로만 확인하고, <b>제출 후 채점하기</b>는 숨은
                테스트까지 채점해요. 막히면 <b>AI 튜터</b> 탭에서 힌트를 받아보세요.{" "}
                <Link href="/guide" className="text-accent underline">
                  이용 가이드
                </Link>
              </p>
              <button
                aria-label="안내 닫기"
                onClick={() => {
                  setShowTip(false);
                  safeSet(TIP_KEY, "1");
                }}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-panel-line px-4 text-xs text-white/60">
            <span>solution.js · JavaScript</span>
            <button
              onClick={() => confirm("코드를 처음 상태로 되돌릴까요?") && setCode(starter)}
              className="hover:text-white"
            >
              초기화
            </button>
          </div>
          <div className="h-[360px] lg:h-auto lg:min-h-0 lg:flex-[3]">
            <CodeEditor value={code} onChange={setCode} onRun={() => grade("run")} />
          </div>
          <div className="min-h-[160px] overflow-y-auto border-t border-panel-line bg-[#152230] lg:min-h-0 lg:flex-[2]">
            <ResultPanel busy={busy} outcome={outcome} />
          </div>
          <div className="sticky bottom-0 flex h-14 shrink-0 items-center justify-end gap-2 border-t border-panel-line bg-[#101c27] px-4">
            <span className="mr-auto hidden text-xs text-white/40 sm:inline">⌘/Ctrl + Enter 로 실행</span>
            <button
              disabled={!!busy}
              onClick={() => grade("run")}
              className="h-9 rounded-md bg-white/10 px-4 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
            >
              {busy === "run" ? "실행 중…" : "코드 실행"}
            </button>
            <button
              disabled={!!busy}
              onClick={() => grade("submit")}
              className="h-9 rounded-md bg-accent px-4 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {busy === "submit" ? "채점 중…" : "제출 후 채점하기"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
