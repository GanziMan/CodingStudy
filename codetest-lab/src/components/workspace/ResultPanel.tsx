import type { RunOutcome } from "./types";

export function ResultPanel({ busy, outcome }: { busy: "run" | "submit" | null; outcome: RunOutcome | null }) {
  if (busy) return <p className="p-4 text-sm text-white/60">{busy === "run" ? "실행 중…" : "채점 중…"}</p>;
  if (!outcome) return <p className="p-4 text-sm text-white/40">실행 결과가 여기에 표시됩니다.</p>;
  if (outcome.mode === "error") return <p className="p-4 text-sm text-bad">{outcome.message}</p>;

  const { results } = outcome;
  const passed = results.filter((r) => r.passed).length;
  const all = passed === results.length;

  return (
    <div className="p-4 font-mono text-[13px]">
      {outcome.mode === "submit" && (
        <div className={`mb-4 rounded-md px-4 py-3 font-sans ${all ? "bg-ok/15 text-ok" : "bg-bad/15 text-bad"}`}>
          <b className="text-base">{all ? "정답입니다!" : "틀렸습니다"}</b>
          <span className="ml-3 text-sm opacity-80">
            {passed} / {results.length} 통과
          </span>
        </div>
      )}
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.index}>
            <div>
              <span className="text-white/60">테스트 {r.index + 1} 〉</span>{" "}
              <span className={r.passed ? "text-ok" : "text-bad"}>{r.passed ? "통과" : "실패"}</span>
              <span className="ml-2 text-white/35">({r.timeMs.toFixed(2)}ms)</span>
              {r.hidden && <span className="ml-2 text-white/35">숨김</span>}
            </div>
            {!r.hidden && (
              <div className="mt-1 space-y-0.5 pl-4 text-white/75">
                <div>입력값 〉 {r.input}</div>
                <div>기댓값 〉 {r.expected}</div>
                <div>
                  실행 결과 〉{" "}
                  {r.error ? <span className="text-bad">{r.error}</span> : <span>{r.actual}</span>}
                </div>
                {r.logs.length > 0 && (
                  <div className="mt-1 rounded bg-black/30 px-2 py-1 text-white/60">
                    <div className="text-[11px] text-white/35">출력</div>
                    {r.logs.map((l, i) => (
                      <div key={i} className="whitespace-pre-wrap">{l}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {r.hidden && r.error && <div className="pl-4 text-bad">{r.error}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
