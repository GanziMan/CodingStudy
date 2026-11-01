"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicTest } from "@/lib/test-hash";
import { runTests } from "@/lib/client-grader";
import { Markdown } from "../Markdown";
import { streamText } from "./types";

type Entry = {
  id: number;
  role: "user" | "assistant";
  title?: string; // 버튼으로 받은 답이면 "힌트 1단계" 같은 이름
  text: string;
  pending?: boolean;
  code?: string; // AI 풀이 코드
  verified?: string; // AI 풀이 검증 결과
};

export function AiPane({
  problemId,
  functionName,
  tests,
  code,
  resultSummary,
  onUseCode,
}: {
  problemId: number;
  functionName: string;
  tests: PublicTest[];
  code: string;
  resultSummary?: string;
  onUseCode: (code: string) => void;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hintLevel, setHintLevel] = useState(1);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const add = (e: Omit<Entry, "id">) => {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { ...e, id }]);
    return id;
  };
  const update = (id: number, patch: Partial<Entry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  // 지금까지의 대화(힌트·해설 포함)를 AI에게 맥락으로 넘긴다
  const history = () =>
    entries
      .filter((e) => e.text && !e.pending)
      .map((e) => ({
        role: e.role,
        content:
          e.role === "assistant" && e.title
            ? `[${e.title}]\n${e.text}${e.code ? `\n\n\`\`\`js\n${e.code}\n\`\`\`` : ""}`
            : e.text,
      }));

  const runStream = async (title: string, url: string, body: object) => {
    setBusy(true);
    const id = add({ role: "assistant", title: title || undefined, text: "", pending: true });
    try {
      await streamText(url, { problemId, ...body }, (text) => update(id, { text }));
    } catch (e) {
      update(id, { text: `> ${e instanceof Error ? e.message : e}` });
    } finally {
      update(id, { pending: false });
      setBusy(false);
    }
  };

  const ask = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    const prev = history();
    add({ role: "user", text: q });
    await runStream("", "/api/ai/chat", { message: q, history: prev, code, resultSummary });
  };

  const hint = async () => {
    const level = hintLevel;
    await runStream(`힌트 ${level}단계`, "/api/ai/hint", { level, code });
    setHintLevel((l) => Math.min(3, l + 1));
  };

  const solve = async () => {
    setBusy(true);
    const id = add({ role: "assistant", title: "AI 풀이", text: "", pending: true });
    try {
      const res = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update(id, { text: data.explanation, code: data.code, verified: "채점 중" });
      const results = await runTests(data.code, functionName, tests, problemId);
      update(id, { verified: `채점 결과 ${results.filter((r) => r.passed).length}/${results.length} 통과` });
    } catch (e) {
      update(id, { text: `> ${e instanceof Error ? e.message : e}` });
    } finally {
      update(id, { pending: false });
      setBusy(false);
    }
  };

  const btn =
    "flex h-8 items-center justify-center rounded-md border border-line bg-surface px-2.5 text-[13px] transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-5 px-5 py-5">
          {entries.length === 0 && (
            <div className="space-y-2 text-sm leading-relaxed text-fg-muted">
              <p>이 문제와 지금 에디터에 있는 코드를 보고 답해요.</p>
              <p>아래 입력창에 무엇이든 물어보거나, 힌트 버튼으로 단계별 힌트를 받아보세요.</p>
            </div>
          )}
          {entries.map((e) =>
            e.role === "user" ? (
              <div key={e.id} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-surface-hover px-3.5 py-2 text-sm leading-relaxed">
                  {e.text}
                </div>
              </div>
            ) : (
              <article key={e.id}>
                {(e.title || e.verified) && (
                  <header className="mb-1.5 flex items-center gap-2 text-[12px]">
                    {e.title && <span className="font-medium text-fg-subtle">{e.title}</span>}
                    {e.verified && <span className="text-ok">{e.verified}</span>}
                  </header>
                )}
                {e.text ? (
                  <Markdown>{e.text}</Markdown>
                ) : (
                  e.pending && <p className="text-sm text-fg-subtle">답변을 쓰는 중</p>
                )}
                {e.code && (
                  <>
                    <pre className="mt-3 overflow-x-auto rounded-md border border-line bg-code p-3 font-mono text-[13px] leading-relaxed">
                      {e.code}
                    </pre>
                    <button
                      onClick={() => onUseCode(e.code!)}
                      className="mt-2 text-[13px] text-fg-muted underline underline-offset-4 hover:text-fg"
                    >
                      에디터로 가져오기
                    </button>
                  </>
                )}
              </article>
            ),
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-surface px-4 py-3">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          <button disabled={busy} onClick={hint} className={btn}>
            힌트 {hintLevel}단계
          </button>
          <button
            disabled={busy}
            onClick={() => runStream("내 코드 리뷰", "/api/ai/review", { code, resultSummary })}
            className={btn}
          >
            내 코드 리뷰
          </button>
          <button disabled={busy} onClick={() => runStream("해설", "/api/ai/explain", {})} className={btn}>
            해설
          </button>
          <button disabled={busy} onClick={solve} className={btn}>
            AI 풀이
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
          className="flex items-end gap-2"
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">AI에게 질문</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // 한글 조합 중 Enter는 무시해야 마지막 글자가 두 번 들어가지 않는다
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  ask();
                }
              }}
              rows={Math.min(5, Math.max(1, input.split("\n").length))}
              placeholder="예: 왜 i=3부터 시작해?"
              className="block w-full resize-none rounded-lg border border-line bg-bg px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-fg-faint focus:border-line-strong"
            />
          </label>
          <button
            disabled={busy || !input.trim()}
            className="h-[38px] shrink-0 rounded-lg bg-fg px-3.5 text-sm font-medium text-bg hover:opacity-85 disabled:opacity-40"
          >
            {busy ? "답변 중" : "보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
