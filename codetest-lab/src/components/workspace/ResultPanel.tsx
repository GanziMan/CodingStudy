import type { RunOutcome } from "./types";

export function ResultPanel({ busy, outcome }: { busy: "run" | "submit" | null; outcome: RunOutcome | null }) {
  if (busy)
    return <p className="p-4 text-sm text-fg-subtle">{busy === "run" ? "예제로 실행하는 중" : "모든 테스트로 채점하는 중"}</p>;
  if (!outcome)
    return (
      <p className="p-4 text-sm text-fg-faint">
        실행 결과가 여기에 표시돼요. 코드 실행은 예제로만 확인하고, 기록은 남지 않아요.
      </p>
    );
  if (outcome.mode === "error") return <p className="p-4 text-sm text-bad">{outcome.message}</p>;

  const { results } = outcome;
  const passed = results.filter((r) => r.passed).length;
  const all = passed === results.length;

  return (
    <div className="p-4 font-mono text-[13px] leading-relaxed">
      {outcome.mode === "submit" && (
        <div
          role="status"
          className={`mb-4 flex items-baseline gap-3 rounded-lg px-4 py-3 font-sans ${all ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}
        >
          <b className="text-[15px] font-semibold">{all ? "정답이에요" : "아직 틀린 테스트가 있어요"}</b>
          <span className="text-sm opacity-80">
            {passed} / {results.length} 통과
          </span>
        </div>
      )}
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.index}>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${r.passed ? "bg-ok" : "bg-bad"}`} aria-hidden />
              <span className="text-fg-muted">테스트 {r.index + 1}</span>
              <span className={r.passed ? "text-ok" : "text-bad"}>{r.passed ? "통과" : "실패"}</span>
              <span className="text-fg-faint">{r.timeMs.toFixed(1)}ms</span>
              {r.hidden && <span className="text-fg-faint">숨은 테스트</span>}
            </div>
            {!r.hidden && (
              <dl className="mt-1.5 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5 pl-3.5 text-fg-muted">
                <dt className="text-fg-subtle">입력값</dt>
                <dd className="break-all">{r.input}</dd>
                <dt className="text-fg-subtle">기댓값</dt>
                <dd className="break-all">{r.expected}</dd>
                <dt className="text-fg-subtle">실행 결과</dt>
                <dd className={`break-all ${r.error ? "text-bad" : ""}`}>{r.error ?? r.actual}</dd>
              </dl>
            )}
            {!r.hidden && r.logs.length > 0 && (
              <div className="ml-3.5 mt-2 rounded-md border border-line bg-code px-3 py-2 text-fg-muted">
                <div className="mb-1 font-sans text-[11px] text-fg-subtle">출력</div>
                {r.logs.map((l, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {l}
                  </div>
                ))}
              </div>
            )}
            {r.hidden && r.error && <div className="pl-3.5 text-bad">{r.error}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
