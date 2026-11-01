import type { Metadata } from "next";
import Link from "next/link";
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

const STEPS = [
  { n: 1, title: "문제 고르기", body: "Lv.1부터 차근차근. 레벨과 유형(DP, 구현 등)으로 골라보세요." },
  { n: 2, title: "코드 작성하고 실행", body: "브라우저에서 바로 실행돼요. 설치도, 회원가입도 필요 없어요." },
  { n: 3, title: "막히면 AI 튜터", body: "정답을 바로 주지 않고 힌트를 1→3단계로 조금씩 알려줘요." },
];

const FEATURES = [
  { icon: "⚡", title: "바로 실행·채점", body: "예제 실행과 숨은 테스트 채점까지 실제 코딩테스트와 같은 방식이에요." },
  { icon: "💡", title: "단계별 힌트", body: "방향 → 점화식 → 구현 순서로, 스스로 풀 수 있을 만큼만 알려줘요." },
  { icon: "🔍", title: "내 코드 리뷰", body: "틀린 코드를 보여주면 무엇이 왜 틀렸고 어떻게 고치면 되는지 짚어줘요." },
  { icon: "📖", title: "쉬운 해설", body: "작은 예시로 값이 채워지는 과정을 따라가며 풀이를 설명해요." },
  { icon: "🤖", title: "AI 문제 만들기", body: "원하는 유형과 레벨로 새 문제를 만들어 무한히 연습할 수 있어요." },
  { icon: "📝", title: "풀이 기록", body: "제출한 코드와 결과가 남아서 다시 보고 복습하기 좋아요." },
];

const FAQ = [
  {
    q: "코딩을 처음 해도 이용할 수 있나요?",
    a: "네. Lv.1 문제는 반복문과 조건문만 알면 풀 수 있고, 막히는 부분은 AI 튜터가 단계별 힌트로 도와줍니다. 이용 가이드에서 함수 작성법과 채점 방식을 먼저 확인해 보세요.",
  },
  {
    q: "무료인가요? 회원가입이 필요한가요?",
    a: "무료이고 회원가입 없이 바로 이용할 수 있어요. 풀이 기록은 지금 쓰는 브라우저에 연결되어 저장됩니다.",
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
  const starters = problems.filter((p) => p.source === "seed").slice(0, 4);

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

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold text-accent">무료 · 회원가입 없음 · 설치 없음</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            AI 튜터와 함께하는
            <br />
            자바스크립트 코딩테스트 연습
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            브라우저에서 바로 코드를 실행하고 채점받으세요. 막히면 AI가 정답 대신 힌트를 조금씩 알려주고, 틀린
            코드는 어디가 틀렸는지 짚어줍니다. 코딩테스트가 처음이어도 괜찮아요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={starters[0] ? `/problems/${starters[0].id}` : "/problems"}
              className="rounded-md bg-accent px-5 py-3 font-semibold hover:opacity-90"
            >
              첫 문제 풀어보기
            </Link>
            <Link href="/guide" className="rounded-md bg-white/10 px-5 py-3 font-semibold hover:bg-white/20">
              처음이라면 이용 가이드
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-xl font-bold">이렇게 시작해요</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-xl border border-line bg-surface p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">추천 시작 문제</h2>
          <Link href="/problems" className="text-sm text-accent hover:underline">
            전체 문제 보기 →
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {starters.map((p) => (
            <li key={p.id}>
              <Link
                href={`/problems/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 hover:border-accent"
              >
                <LevelBadge level={p.level} />
                <span className="font-medium">{p.title}</span>
                <span className="ml-auto text-sm text-muted">{p.category}</span>
                {p.status === "solved" && <span className="text-sm font-semibold text-ok">해결</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-xl font-bold">코테랩에서 할 수 있는 것</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span aria-hidden className="text-2xl">{f.icon}</span>
                <h3 className="mt-2 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-xl font-bold">자주 묻는 질문</h2>
        <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">
                <span className="mr-2 text-accent">Q.</span>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
