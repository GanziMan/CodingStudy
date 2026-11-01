import Link from "next/link";
import { listProblems } from "@/lib/problems";
import { ProblemTable } from "@/components/ProblemTable";

export const dynamic = "force-dynamic";

export default async function Home() {
  const problems = await listProblems();
  const solved = problems.filter((p) => p.status === "solved").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">코딩테스트 연습</h1>
          <p className="mt-1 text-sm text-muted">
            {problems.length}문제 중 <b className="text-ok">{solved}</b>문제 해결
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
