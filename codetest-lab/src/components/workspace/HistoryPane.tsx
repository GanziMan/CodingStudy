import type { ClientSubmission } from "./types";

export function HistoryPane({
  submissions,
  onLoad,
}: {
  submissions: ClientSubmission[];
  onLoad: (code: string) => void;
}) {
  if (submissions.length === 0)
    return (
      <p className="px-6 py-8 text-sm text-fg-subtle">
        아직 제출 기록이 없어요. 제출 후 채점하기를 누르면 코드와 결과가 여기에 남아요.
      </p>
    );
  return (
    <ul className="divide-y divide-line">
      {submissions.map((s) => (
        <li key={s.id} className="flex items-center gap-4 px-6 py-3 text-sm">
          <span className={`w-10 ${s.passed ? "text-ok" : "text-bad"}`}>{s.passed ? "정답" : "오답"}</span>
          <span className="font-mono text-[13px] text-fg-muted">
            {s.passedCount}/{s.totalCount}
          </span>
          <span className="text-[13px] text-fg-subtle">{new Date(s.createdAt).toLocaleString("ko-KR")}</span>
          <button onClick={() => onLoad(s.code)} className="ml-auto text-[13px] text-fg-muted underline underline-offset-4 hover:text-fg">
            코드 불러오기
          </button>
        </li>
      ))}
    </ul>
  );
}
