import type { Metadata } from "next";
import Link from "next/link";
import { HeroPreview } from "@/components/HeroPreview";
import { JsonLd } from "@/components/JsonLd";
import { LevelBadge } from "@/components/LevelBadge";
import { listProblems } from "@/lib/problems";
import { SITE, absoluteUrl } from "@/lib/site";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  alternates: { canonical: "/" },
};

const FLOW = [
  {
    step: "작성",
    title: "solution 함수에 답을 return",
    body: "입력은 매개변수로 들어오고, return한 값으로 채점해요. 많은 기업 코딩테스트와 같은 형식이에요.",
  },
  {
    step: "실행",
    title: "예제로 먼저 확인",
    body: "코드 실행은 화면의 입출력 예로만 돌려봐요. console.log 출력도 함께 보여줘요.",
  },
  {
    step: "제출",
    title: "숨은 테스트까지 채점",
    body: "빈 배열이나 아주 큰 입력 같은 경계값까지 채점하고, 시간 초과·스택 오버플로는 이유를 알려줘요.",
  },
];

const FAQ = [
  {
    q: "코딩을 처음 해도 이용할 수 있나요?",
    a: "네. Lv.1 문제는 반복문과 조건문만 알면 풀 수 있어요. 이용 가이드에서 함수 작성법과 채점 방식, 에러 메시지 읽는 법을 먼저 확인해 보세요.",
  },
  {
    q: "무료인가요? 회원가입이 필요한가요?",
    a: "무료이고 회원가입 없이 바로 이용할 수 있어요. 풀이 기록은 지금 쓰는 브라우저에 저장됩니다.",
  },
  {
    q: "어떤 언어로 풀 수 있나요?",
    a: "JavaScript로 풉니다. 많은 기업 코딩테스트에서 쓰는 solution 함수 형식과 같아서 실전 연습에 바로 도움이 돼요.",
  },
];

export default async function Home() {
  const problems = await listProblems(await getUserId());
  const starters = problems.filter((p) => p.source === "seed").slice(0, 6);
  const first = starters[0];
  
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE.name,
              url: absoluteUrl("/"),
              description: SITE.description,
              inLanguage: "ko-KR",
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <section className="border-b border-line bg-bg-subtle">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[42px]">
              자바스크립트 코딩테스트,
              <br />
              브라우저에서 바로 채점까지
            </h1>
            <p className="mt-5 max-w-[34em] text-[17px] leading-relaxed text-fg-muted">
              설치도 회원가입도 없이 코드를 실행하고, 실제 코딩테스트처럼 숨은 테스트까지 채점받으세요. 틀리면 어떤
              입력에서 왜 틀렸는지 바로 보여줘요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={first ? `/problems/${first.id}` : "/problems"}
                className="inline-flex h-10 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85"
              >
                첫 문제 풀어보기
              </Link>
              <Link
                href="/guide"
                className="inline-flex h-10 items-center rounded-md border border-line-strong bg-surface px-4 text-sm font-medium hover:bg-surface-hover"
              >
                처음이라면 이용 가이드
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">실제 코딩테스트와 같은 방식으로</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            작성하고, 예제로 확인하고, 숨은 테스트로 제출하는 흐름을 그대로 연습해요. 처음이라면{" "}
            <Link href="/guide" className="text-fg underline underline-offset-4">
              이용 가이드
            </Link>
            를 먼저 읽어보세요.
          </p>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {FLOW.map((f) => (
            <li key={f.step} className="bg-surface p-6">
              <p className="font-mono text-xs text-fg-subtle">{f.step}</p>
              <h3 className="mt-2 font-semibold">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{f.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">여기서 시작해 보세요</h2>
              <p className="mt-2 text-fg-muted">쉬운 문제부터 DP 기본기까지 차근차근 이어지는 순서예요.</p>
            </div>
            <Link href="/problems" className="text-sm text-fg-muted underline underline-offset-4 hover:text-fg">
              전체 문제 보기
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-line rounded-xl border border-line">
            {starters.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/problems/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                >
                  <LevelBadge level={p.level} />
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-auto text-sm text-fg-subtle">{p.category}</span>
                  {p.status === "solved" && <span className="text-sm text-ok">해결</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl font-semibold tracking-tight">자주 묻는 질문</h2>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <svg
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    className="shrink-0 text-fg-subtle transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
