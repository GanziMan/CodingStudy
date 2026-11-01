import { notFound } from "next/navigation";
import { getProblem, listSubmissions, starterCode, toPublic } from "@/lib/problems";
import { Workspace } from "@/components/workspace/Workspace";

export const dynamic = "force-dynamic";

export default async function ProblemPage({ params }: PageProps<"/problems/[id]">) {
  const { id } = await params;
  const problem = await getProblem(Number(id));
  if (!problem) notFound();
  const subs = await listSubmissions(problem.id);

  return (
    <Workspace
      problem={toPublic(problem)}
      starter={starterCode(problem)}
      initialSubmissions={subs.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))}
    />
  );
}
