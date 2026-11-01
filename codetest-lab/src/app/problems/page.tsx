import type { Metadata } from "next";
import { OG_BASE } from "@/lib/site";
import Link from "next/link";
import { ProblemTable } from "@/components/ProblemTable";
import { listProblems } from "@/lib/problems";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "자바스크립트 코딩테스트 문제 목록 (레벨·유형별)",
  description:
    "Lv.1부터 Lv.5까지 레벨별, DP·구현·그리디 등 유형별 자바스크립트 코딩테스트 연습 문제 모음. 브라우저에서 바로 풀고 채점받으세요.",
  alternates: { canonical: "/problems" },
  openGraph: { ...OG_BASE, url: "/problems", title: "자바스크립트 코딩테스트 문제 목록 (레벨·유형별) | 코테랩" },
};

export default async function ProblemsPage() {
  const problems = await listProblems(await getUserId());
  const solved = problems.filter((p) => p.status === "solved").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">코딩테스트 연습 문제</h1>
          <p className="mt-1 text-sm text-muted">
            {problems.length}문제 중 <b className="text-ok">{solved}</b>문제 해결 · 처음이라면 Lv.1부터 시작해 보세요
          </p>
        </div>
        <Link
          href="/generate"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + AI로 새 문제 만들기
        </Link>
      </div>
      <ProblemTable problems={problems} />
    </main>
  );
}
