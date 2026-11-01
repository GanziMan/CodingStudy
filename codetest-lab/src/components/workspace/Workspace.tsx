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
  owner,
}: {
  problem: PublicProblem;
  starter: string;
  initialSubmissions: ClientSubmission[];
  owner: boolean;
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
        const raw = await runTests(code, problem.functionName, tests, problem.id);
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
      className={`relative h-11 shrink-0 px-3 text-sm transition-colors ${
        tab === t
          ? "text-fg after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-fg"
          : "text-fg-subtle hover:text-fg"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-3.5rem)]">
      <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-4 py-2 sm:px-5">
        <Link href="/problems" className="text-[13px] text-fg-subtle hover:text-fg">
          문제 목록
        </Link>
        <span className="text-fg-faint" aria-hidden>
          /
        </span>
        <h1 className="truncate text-[15px] font-semibold">{problem.title}</h1>
        <LevelBadge level={problem.level} />
        <span className="text-[13px] text-fg-subtle">{problem.category}</span>
        {problem.source === "ai" && (
          <span className="rounded border border-line px-1 text-[11px] text-fg-subtle">AI 생성</span>
        )}
        {solved && <span className="text-[13px] text-ok">해결함</span>}
        {problem.isMine && (
          <button onClick={deleteProblem} className="ml-auto text-[13px] text-fg-subtle hover:text-bad">
            문제 삭제
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-0 flex-col border-line lg:w-[44%] lg:border-r">
          <div role="tablist" className="flex shrink-0 overflow-x-auto border-b border-line px-2">
            {tabBtn("problem", "문제 설명")}
            {owner && tabBtn("ai", "AI 튜터")}
            {tabBtn("history", subs.length ? `내 제출 ${subs.length}` : "내 제출")}
          </div>
          <div className="max-h-[60vh] min-h-0 flex-1 overflow-y-auto lg:max-h-none">
            <div hidden={tab !== "problem"}>
              <ProblemPane problem={problem} />
            </div>
            {owner && (
            <div hidden={tab !== "ai"} className="h-[60vh] lg:h-full">
              <AiPane
                problemId={problem.id}
                functionName={problem.functionName}
                tests={problem.tests}
                code={code}
                resultSummary={resultSummary}
                onUseCode={(c) => {
                  if (confirm("에디터의 코드를 AI 풀이로 바꿀까요? 지금 코드는 사라져요.")) setCode(c);
                }}
              />
            </div>
            )}
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

        <section className="flex flex-1 flex-col border-t border-line lg:min-h-0 lg:border-t-0">
          {showTip && (
            <div className="flex items-start gap-3 border-b border-line bg-accent-soft px-4 py-3 text-[13px] leading-relaxed text-fg">
              <p className="flex-1">
                <code className="font-mono text-accent">{problem.functionName}</code> 함수 안에 코드를 쓰고 답을{" "}
                <b className="font-semibold">return</b> 하면 돼요. 코드 실행은 예제로만 확인하고, 제출 후 채점하기는 숨은
                테스트까지 채점해요.{" "}
                <Link href="/guide" className="underline underline-offset-4">
                  이용 가이드
                </Link>
              </p>
              <button
                aria-label="안내 닫기"
                onClick={() => {
                  setShowTip(false);
                  safeSet(TIP_KEY, "1");
                }}
                className="text-fg-subtle hover:text-fg"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-line px-4 text-[13px] text-fg-subtle">
            <span className="font-mono text-[12px]">solution.js</span>
            <button
              onClick={() => confirm("코드를 처음 상태로 되돌릴까요?") && setCode(starter)}
              className="hover:text-fg"
            >
              처음 코드로 되돌리기
            </button>
          </div>
          <div className="h-[360px] lg:h-auto lg:min-h-0 lg:flex-[3]">
            <CodeEditor value={code} onChange={setCode} onRun={() => grade("run")} />
          </div>
          <div className="min-h-[160px] overflow-y-auto border-t border-line bg-bg-subtle lg:min-h-0 lg:flex-[2]">
            <div className="flex h-9 items-center border-b border-line px-4 text-[13px] font-medium">실행 결과</div>
            <ResultPanel busy={busy} outcome={outcome} />
          </div>
          <div className="sticky bottom-0 flex h-14 shrink-0 items-center justify-end gap-2 border-t border-line bg-surface px-4">
            <span className="mr-auto hidden text-[12px] text-fg-subtle sm:inline">
              <kbd className="rounded border border-line px-1 font-mono">⌘/Ctrl</kbd> +{" "}
              <kbd className="rounded border border-line px-1 font-mono">Enter</kbd> 로 실행
            </span>
            <button
              disabled={!!busy}
              onClick={() => grade("run")}
              className="h-9 rounded-md border border-line-strong px-4 text-sm font-medium hover:bg-surface-hover disabled:opacity-50"
            >
              {busy === "run" ? "실행 중" : "코드 실행"}
            </button>
            <button
              disabled={!!busy}
              onClick={() => grade("submit")}
              className="h-9 rounded-md bg-fg px-4 text-sm font-medium text-bg hover:opacity-85 disabled:opacity-50"
            >
              {busy === "submit" ? "채점 중" : "제출 후 채점하기"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
