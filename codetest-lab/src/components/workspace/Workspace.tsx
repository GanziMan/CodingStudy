"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { PublicProblem } from "@/lib/problems";
import { LevelBadge } from "../LevelBadge";
import { AiPane } from "./AiPane";
import { CodeEditor } from "./CodeEditor";
import { HistoryPane } from "./HistoryPane";
import { ProblemPane } from "./ProblemPane";
import { ResultPanel } from "./ResultPanel";
import type { ClientSubmission, RunOutcome } from "./types";

type Tab = "problem" | "ai" | "history";

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
  const [code, setCode] = useState(() => {
    if (typeof window === "undefined") return starter;
    try {
      return localStorage.getItem(storageKey) ?? starter;
    } catch {
      return starter;
    }
  });
  const [tab, setTab] = useState<Tab>("problem");
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [subs, setSubs] = useState(initialSubmissions);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, code);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [code, storageKey]);

  const solved = subs.some((s) => s.passed);

  const grade = useCallback(
    async (mode: "run" | "submit") => {
      setBusy(mode);
      setOutcome(null);
      try {
        const res = await fetch(`/api/problems/${problem.id}/${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "실행 실패");
        setOutcome({ mode, results: data.results });
        if (mode === "submit") {
          setSubs((prev) => [
            { ...data.submission, title: problem.title, level: problem.level },
            ...prev,
          ]);
          router.refresh();
        }
      } catch (e) {
        setOutcome({ mode: "error", message: e instanceof Error ? e.message : String(e) });
      } finally {
        setBusy(null);
      }
    },
    [code, problem.id, problem.title, problem.level, router],
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
    if (!confirm("이 AI 문제와 풀이 기록을 삭제할까요?")) return;
    const res = await fetch(`/api/problems/${problem.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  };

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`h-11 border-b-2 px-4 text-sm ${tab === t ? "border-accent text-white" : "border-transparent text-white/55 hover:text-white"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col bg-panel-2 text-white">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-panel-line bg-navy/60 px-4">
        <h1 className="truncate font-semibold">{problem.title}</h1>
        <LevelBadge level={problem.level} />
        <span className="text-xs text-white/50">{problem.category}</span>
        {solved && <span className="text-xs font-semibold text-ok">✓ 해결</span>}
        {problem.source === "ai" && (
          <button onClick={deleteProblem} className="ml-auto text-xs text-white/40 hover:text-bad">
            문제 삭제
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-0 flex-col border-panel-line lg:w-[44%] lg:border-r">
          <div className="flex shrink-0 border-b border-panel-line px-2">
            {tabBtn("problem", "문제 설명")}
            {tabBtn("ai", "AI 튜터")}
            {tabBtn("history", `제출 기록 ${subs.length ? `(${subs.length})` : ""}`)}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div hidden={tab !== "problem"}>
              <ProblemPane problem={problem} />
            </div>
            <div hidden={tab !== "ai"} className="h-full">
              <AiPane
                problemId={problem.id}
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

        <section className="flex min-h-[420px] flex-1 flex-col">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-panel-line px-4 text-xs text-white/60">
            <span>solution.js · JavaScript</span>
            <button
              onClick={() => confirm("코드를 처음 상태로 되돌릴까요?") && setCode(starter)}
              className="hover:text-white"
            >
              초기화
            </button>
          </div>
          <div className="min-h-0 flex-[3]">
            <CodeEditor value={code} onChange={setCode} onRun={() => grade("run")} />
          </div>
          <div className="min-h-0 flex-[2] overflow-y-auto border-t border-panel-line bg-[#152230]">
            <ResultPanel busy={busy} outcome={outcome} />
          </div>
          <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-t border-panel-line bg-navy/60 px-4">
            <span className="mr-auto text-xs text-white/40">⌘/Ctrl + Enter 로 실행</span>
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
