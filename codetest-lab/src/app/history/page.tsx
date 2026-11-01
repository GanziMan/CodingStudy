import type { Metadata } from "next";
import Link from "next/link";
import { listSubmissions } from "@/lib/problems";
import { LevelBadge } from "@/components/LevelBadge";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 풀이 기록",
  robots: { index: false, follow: true },
};

export default async function HistoryPage() {
  const subs = await listSubmissions(await getUserId());

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-[28px] font-semibold tracking-tight">내 풀이 기록</h1>
      <p className="mb-8 mt-1.5 text-fg-muted">기록은 지금 쓰는 브라우저에 연결되어 저장돼요. 브라우저 쿠키를 지우면 기록이 보이지 않아요.</p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-[13px] text-fg-subtle">
            <tr className="border-b border-line bg-bg-subtle">
              <th className="px-4 py-3 font-normal">문제</th>
              <th className="w-24 px-4 py-3 font-normal">난이도</th>
              <th className="w-20 px-4 py-3 font-normal">결과</th>
              <th className="w-24 px-4 py-3 font-normal">통과</th>
              <th className="w-44 px-4 py-3 font-normal">제출 시각</th>
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
                <td className={`px-4 py-3 ${s.passed ? "text-ok" : "text-bad"}`}>
                  {s.passed ? "정답" : "오답"}
                </td>
                <td className="px-4 py-3 text-fg-subtle">
                  {s.passedCount}/{s.totalCount}
                </td>
                <td className="px-4 py-3 text-fg-subtle">{s.createdAt.toLocaleString("ko-KR")}</td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-fg-subtle">아직 제출 기록이 없어요. <Link href="/problems" className="text-accent hover:underline">문제 풀러 가기</Link></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
