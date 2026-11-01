import type { ClientSubmission } from "./types";

export function HistoryPane({
  submissions,
  onLoad,
}: {
  submissions: ClientSubmission[];
  onLoad: (code: string) => void;
}) {
  if (submissions.length === 0) return <p className="p-6 text-sm text-white/50">아직 제출 기록이 없습니다.</p>;
  return (
    <ul className="divide-y divide-panel-line">
      {submissions.map((s) => (
        <li key={s.id} className="flex items-center gap-3 px-6 py-3 text-sm">
          <span className={`w-14 font-semibold ${s.passed ? "text-ok" : "text-bad"}`}>
            {s.passed ? "정답" : "오답"}
          </span>
          <span className="text-white/60">
            {s.passedCount}/{s.totalCount}
          </span>
          <span className="text-xs text-white/40">{new Date(s.createdAt).toLocaleString("ko-KR")}</span>
          <button onClick={() => onLoad(s.code)} className="ml-auto text-xs text-accent hover:underline">
            코드 불러오기
          </button>
        </li>
      ))}
    </ul>
  );
}
