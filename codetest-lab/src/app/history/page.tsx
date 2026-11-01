import Link from "next/link";
import { listSubmissions } from "@/lib/problems";
import { LevelBadge } from "@/components/LevelBadge";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const subs = await listSubmissions();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">풀이 기록</h1>
      <div className="rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-line">
              <th className="px-4 py-3 font-medium">문제</th>
              <th className="w-24 px-4 py-3 font-medium">난이도</th>
              <th className="w-20 px-4 py-3 font-medium">결과</th>
              <th className="w-24 px-4 py-3 font-medium">통과</th>
              <th className="w-44 px-4 py-3 font-medium">제출 시각</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/problems/${s.problemId}`} className="font-medium hover:text-accent">
                    {s.title}
                  </Link>
                </td>
                <td className="px-4 py-3"><LevelBadge level={s.level} /></td>
                <td className={`px-4 py-3 font-semibold ${s.passed ? "text-ok" : "text-bad"}`}>
                  {s.passed ? "정답" : "오답"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {s.passedCount}/{s.totalCount}
                </td>
                <td className="px-4 py-3 text-muted">{s.createdAt.toLocaleString("ko-KR")}</td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">아직 제출 기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
