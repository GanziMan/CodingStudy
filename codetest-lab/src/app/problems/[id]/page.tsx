import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Workspace } from "@/components/workspace/Workspace";
import { getProblem, listSubmissions, plainSummary, starterCode, toPublic } from "@/lib/problems";
import { OG_BASE, SITE, absoluteUrl } from "@/lib/site";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/problems/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = await getProblem(Number(id));
  if (!p) return { title: "문제를 찾을 수 없어요", robots: { index: false } };
  const title = `${p.title} - 자바스크립트 코딩테스트 Lv.${p.level} ${p.category} 문제`;
  const description = `${plainSummary(p.description, 120)} 브라우저에서 바로 풀고 채점받고, AI 힌트와 해설로 공부하세요.`;
  return {
    title,
    description,
    alternates: { canonical: `/problems/${p.id}` },
    openGraph: {
      ...OG_BASE,
      title: `${title} | ${SITE.name}`,
      description,
      url: `/problems/${p.id}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default async function ProblemPage({ params }: PageProps<"/problems/[id]">) {
  const { id } = await params;
  const problem = await getProblem(Number(id));
  if (!problem) notFound();
  const userId = await getUserId();
  const subs = await listSubmissions(userId, problem.id);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: problem.title,
          description: plainSummary(problem.description, 200),
          url: absoluteUrl(`/problems/${problem.id}`),
          inLanguage: "ko-KR",
          learningResourceType: "코딩테스트 연습 문제",
          educationalLevel: `Lv.${problem.level}`,
          teaches: problem.category,
          programmingLanguage: "JavaScript",
          isAccessibleForFree: true,
          provider: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
        }}
      />
      <Workspace
        problem={toPublic(problem, userId)}
        starter={starterCode(problem)}
        initialSubmissions={subs.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))}
      />
    </>
  );
}
