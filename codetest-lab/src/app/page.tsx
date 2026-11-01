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

const HINTS = [
  {
    level: "1단계",
    title: "방향만",
    body: "이 문제는 DP예요. dp[i]를 'i번째 칸까지 가는 방법의 수'로 정의해 보세요.",
  },
  {
    level: "2단계",
    title: "점화식의 모양",
    body: "i번째 칸에는 i-1칸 또는 i-2칸에서 올 수 있어요. 그러면 dp[i]는 앞의 두 값으로 표현돼요.",
  },
  {
    level: "3단계",
    title: "구현 직전까지",
    body: "dp[1]=1, dp[2]=2로 시작해서 i=3부터 n까지 채우고, 매번 1,000,000,007로 나눈 나머지를 저장하세요.",
  },
];

const FAQ = [
  {
    q: "코딩을 처음 해도 이용할 수 있나요?",
    a: "네. Lv.1 문제는 반복문과 조건문만 알면 풀 수 있고, 막히는 부분은 AI 튜터가 단계별 힌트로 도와줍니다. 이용 가이드에서 함수 작성법과 채점 방식을 먼저 확인해 보세요.",
  },
  {
    q: "무료인가요? 회원가입이 필요한가요?",
    a: "무료이고 회원가입 없이 바로 이용할 수 있어요. 풀이 기록은 지금 쓰는 브라우저에 저장됩니다.",
  },
  {
    q: "어떤 언어로 풀 수 있나요?",
    a: "JavaScript로 풉니다. 많은 기업 코딩테스트에서 쓰는 solution 함수 형식과 같아서 실전 연습에 바로 도움이 돼요.",
  },
  {
    q: "AI 튜터는 정답을 바로 알려주나요?",
    a: "기본은 힌트입니다. 1단계는 방향만, 3단계로 갈수록 구체적으로 알려줘요. 충분히 고민한 뒤에는 해설과 AI 풀이도 볼 수 있어요.",
  },
];

export default async function Home() {
  const problems = await listProblems(await getUserId());
  const starters = problems.filter((p) => p.source === "seed").slice(0, 6);
  const first = starters[0];
  const stairs = problems.find((p) => p.title === "계단 오르기");

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
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-24">
          <div>
            <h1 className="text-[34px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[46px]">
              자바스크립트 코딩테스트,
              <br />
              막히면 힌트부터
            </h1>
            <p className="mt-5 max-w-[34em] text-[17px] leading-relaxed text-fg-muted">
              브라우저에서 바로 코드를 실행하고 채점받으세요. 막히는 순간 정답 대신 다음 한 걸음만 알려주고, 틀린
              코드는 어디가 왜 틀렸는지 짚어줍니다. 설치도, 회원가입도 필요 없어요.
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
          <h2 className="text-2xl font-semibold tracking-tight">힌트는 세 단계로 나눠서 받아요</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            필요한 만큼만 열어보세요. 대부분은 1단계나 2단계에서 스스로 풀 수 있어요. 아래는{" "}
            {stairs ? (
              <Link href={`/problems/${stairs.id}`} className="text-fg underline underline-offset-4">
                계단 오르기
              </Link>
            ) : (
              "계단 오르기"
            )}{" "}
            문제의 실제 힌트 예시예요.
          </p>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {HINTS.map((h) => (
            <li key={h.level} className="bg-surface p-6">
              <p className="font-mono text-xs text-fg-subtle">{h.level}</p>
              <h3 className="mt-2 font-semibold">{h.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{h.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-fg-subtle">
          그래도 어렵다면 내 코드 리뷰, 해설, AI 풀이 순서로 도움을 더 받을 수 있어요.
        </p>
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
