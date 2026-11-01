"use client";

import { useRef, useState } from "react";
import type { TestCase } from "@/db/schema";
import { runTests } from "@/lib/client-grader";
import { Markdown } from "../Markdown";
import { streamText, type AiEntry } from "./types";

export function AiPane({
  problemId,
  functionName,
  tests,
  code,
  solved,
  resultSummary,
  onUseCode,
}: {
  problemId: number;
  functionName: string;
  tests: TestCase[];
  code: string;
  solved: boolean;
  resultSummary?: string;
  onUseCode: (code: string) => void;
}) {
  const [entries, setEntries] = useState<AiEntry[]>([]);
  const [hintLevel, setHintLevel] = useState(1);
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);

  const update = (id: number, patch: Partial<AiEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const start = (title: string) => {
    const id = nextId.current++;
    setEntries((prev) => [{ id, title, text: "", pending: true }, ...prev]);
    return id;
  };

  const spoilerOk = (what: string) =>
    solved || confirm(`아직 이 문제를 맞히지 않았어요. 그래도 ${what}을(를) 볼까요?`);

  const runStream = async (title: string, url: string, body: object) => {
    setBusy(true);
    const id = start(title);
    try {
      await streamText(url, { problemId, ...body }, (text) => update(id, { text }));
    } catch (e) {
      update(id, { text: `> ⚠️ ${e instanceof Error ? e.message : e}` });
    } finally {
      update(id, { pending: false });
      setBusy(false);
    }
  };

  const hint = async () => {
    const level = hintLevel;
    await runStream(`힌트 ${level}단계`, "/api/ai/hint", { level, code });
    setHintLevel((l) => Math.min(3, l + 1));
  };

  const solve = async () => {
    if (!spoilerOk("AI 풀이")) return;
    setBusy(true);
    const id = start("AI 풀이");
    try {
      const res = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update(id, { text: data.explanation, code: data.code, verified: "채점 중…" });
      const results = await runTests(data.code, functionName, tests);
      const passed = results.filter((r) => r.passed).length;
      update(id, { verified: `채점 결과 ${passed}/${results.length} 통과` });
    } catch (e) {
      update(id, { text: `> ⚠️ ${e instanceof Error ? e.message : e}` });
    } finally {
      update(id, { pending: false });
      setBusy(false);
    }
  };

  const btn =
    "flex h-9 items-center justify-center rounded-md border border-line bg-surface px-3 text-[13px] font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-line bg-surface px-5 py-4">
        <div className="grid grid-cols-2 gap-2">
          <button disabled={busy} onClick={hint} className={`${btn} border-line-strong`}>
            힌트 {hintLevel}단계 받기
          </button>
          <button
            disabled={busy}
            onClick={() => runStream("내 코드 리뷰", "/api/ai/review", { code, resultSummary })}
            className={btn}
          >
            내 코드 리뷰
          </button>
          <button
            disabled={busy}
            onClick={() => spoilerOk("해설") && runStream("해설", "/api/ai/explain", {})}
            className={btn}
          >
            해설 보기
          </button>
          <button disabled={busy} onClick={solve} className={btn}>
            AI 풀이 보기
          </button>
        </div>
        <p className="mt-2.5 text-[12px] text-fg-subtle">해설과 AI 풀이에는 정답 코드가 들어 있어요.</p>
      </div>

      <div className="space-y-4 px-5 py-5">
        {entries.length === 0 && (
          <div className="space-y-2 text-sm leading-relaxed text-fg-muted">
            <p>막히면 힌트부터 받아보세요. 1단계는 방향만, 3단계로 갈수록 구체적이에요.</p>
            <p>코드를 썼는데 틀렸다면 내 코드 리뷰가 무엇이 왜 틀렸는지 짚어줘요.</p>
          </div>
        )}
        {entries.map((e) => (
          <article key={e.id} className="rounded-lg border border-line bg-surface">
            <header className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-[13px]">
              <span className="font-medium">{e.title}</span>
              {e.pending && <span className="text-fg-subtle">답변을 쓰는 중</span>}
              {e.verified && <span className="ml-auto text-ok">{e.verified}</span>}
            </header>
            <div className="px-4 py-3">
              {e.text && <Markdown>{e.text}</Markdown>}
              {e.code && (
                <>
                  <pre className="mt-3 overflow-x-auto rounded-md border border-line bg-code p-3 font-mono text-[13px] leading-relaxed">
                    {e.code}
                  </pre>
                  <button
                    onClick={() => onUseCode(e.code!)}
                    className="mt-2.5 text-[13px] text-fg-muted underline underline-offset-4 hover:text-fg"
                  >
                    에디터로 가져오기
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
