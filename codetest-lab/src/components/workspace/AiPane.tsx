"use client";

import { useRef, useState } from "react";
import { Markdown } from "../Markdown";
import { streamText, type AiEntry } from "./types";

export function AiPane({
  problemId,
  code,
  solved,
  resultSummary,
  onUseCode,
}: {
  problemId: number;
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
      update(id, {
        text: data.explanation,
        code: data.code,
        verified: `채점 결과 ${data.passedCount}/${data.totalCount} 통과`,
      });
    } catch (e) {
      update(id, { text: `> ⚠️ ${e instanceof Error ? e.message : e}` });
    } finally {
      update(id, { pending: false });
      setBusy(false);
    }
  };

  const btn =
    "rounded-md border border-panel-line bg-white/5 px-3 py-2 text-sm hover:border-accent hover:bg-accent/10 disabled:opacity-40";

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 grid grid-cols-2 gap-2 border-b border-panel-line bg-panel-2 p-4">
        <button disabled={busy} onClick={hint} className={btn}>
          💡 힌트 {hintLevel}단계
        </button>
        <button
          disabled={busy}
          onClick={() => runStream("내 코드 리뷰", "/api/ai/review", { code, resultSummary })}
          className={btn}
        >
          🔍 내 코드 리뷰
        </button>
        <button
          disabled={busy}
          onClick={() => spoilerOk("해설") && runStream("해설", "/api/ai/explain", {})}
          className={btn}
        >
          📖 해설 보기
        </button>
        <button disabled={busy} onClick={solve} className={btn}>
          🤖 AI가 풀어보기
        </button>
      </div>

      <div className="space-y-4 p-4">
        {entries.length === 0 && (
          <p className="px-2 py-6 text-sm leading-relaxed text-white/50">
            막히면 힌트부터 단계별로 받아보세요. 코드를 짜고 틀렸다면 <b>내 코드 리뷰</b>로 무엇이 틀렸는지
            짚어줍니다. 해설과 AI 풀이는 정답 코드가 포함돼요.
          </p>
        )}
        {entries.map((e) => (
          <article key={e.id} className="rounded-lg border border-panel-line bg-panel p-4">
            <header className="mb-2 flex items-center gap-2 text-xs font-semibold text-accent">
              {e.title}
              {e.pending && <span className="animate-pulse text-white/40">생각 중…</span>}
              {e.verified && <span className="text-ok">{e.verified}</span>}
            </header>
            {e.text && <Markdown dark>{e.text}</Markdown>}
            {e.code && (
              <>
                <pre className="mt-3 overflow-x-auto rounded-md bg-[#0f1a24] p-3 font-mono text-[13px] text-[#e6edf3]">
                  {e.code}
                </pre>
                <button onClick={() => onUseCode(e.code!)} className="mt-2 text-xs text-accent hover:underline">
                  에디터로 가져오기
                </button>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
