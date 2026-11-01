import type { Metadata } from "next";
import { OG_BASE } from "@/lib/site";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "코딩테스트 처음이라면? 이용 가이드 (solution 함수·채점 방법)",
  description:
    "코딩테스트가 처음인 분을 위한 가이드. solution 함수에 return 하는 법, 코드 실행과 제출의 차이, 시간 초과·스택 오버플로 같은 결과 읽는 법, 자주 하는 실수를 쉽게 정리했어요.",
  alternates: { canonical: "/guide" },
  openGraph: { ...OG_BASE, url: "/guide", title: "코딩테스트 처음이라면? 이용 가이드 (solution 함수·채점 방법) | 코테랩" },
};

const Code = ({ children }: { children: string }) => (
  <pre className="mt-3 overflow-x-auto rounded-lg bg-code border border-line p-4 font-mono text-[13px] leading-relaxed text-fg">
    {children}
  </pre>
);

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20 border-t border-line pt-10">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <div className="mt-4 space-y-3 leading-relaxed text-fg-muted">{children}</div>
  </section>
);

const TOC = [
  ["function", "1. solution 함수에 답을 return 해요"],
  ["examples", "2. 입출력 예 읽는 법"],
  ["run-submit", "3. 코드 실행과 제출의 차이"],
  ["results", "4. 결과 메시지 읽는 법"],
  ["mistakes", "5. 초보자가 자주 하는 실수"],
] as const;

export default function GuidePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "코테랩에서 코딩테스트 문제 푸는 방법",
          inLanguage: "ko-KR",
          url: absoluteUrl("/guide"),
          step: [
            { "@type": "HowToStep", name: "문제 고르기", text: "문제 목록에서 Lv.1 문제부터 고릅니다." },
            { "@type": "HowToStep", name: "solution 함수 작성", text: "solution 함수 안에 코드를 쓰고 답을 return 합니다." },
            { "@type": "HowToStep", name: "코드 실행", text: "코드 실행 버튼으로 입출력 예를 통과하는지 확인합니다." },
            { "@type": "HowToStep", name: "제출 후 채점", text: "제출 후 채점하기로 숨은 테스트까지 채점받습니다." },
          ],
        }}
      />

            <h1 className="text-[32px] font-semibold leading-tight tracking-tight">코딩테스트가 처음이라면 여기부터</h1>
      <p className="mt-4 leading-relaxed text-fg-subtle">
        코테랩은 많은 기업 코딩테스트와 같은 방식으로 문제를 풀어요. 5분만 읽으면 바로 시작할 수 있어요.
      </p>

      <nav aria-label="목차" className="mt-8 rounded-xl border border-line p-5">
        <ol className="space-y-1.5 text-sm">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-fg-muted hover:text-accent">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        <Section id="function" title="1. solution 함수에 답을 return 해요">
          <p>
            문제를 열면 에디터에 <code>solution</code> 함수가 미리 적혀 있어요. 입력값은 함수의 <b>매개변수</b>로
            들어오고, 정답은 <b>return</b>으로 돌려주면 채점돼요.
          </p>
          <Code>{`function solution(numbers) {
  // numbers 에 [3, 1, 9, 4] 같은 배열이 들어와요
  let max = Math.max(...numbers);
  let min = Math.min(...numbers);
  return max - min;   // ← 이 값으로 채점해요
}`}</Code>
          <p>
            <b>console.log로 출력해도 채점되지 않아요.</b> console.log는 중간값을 확인하는 용도로만 쓰고, 답은 꼭
            return 하세요. 출력한 내용은 실행 결과의 &ldquo;출력&rdquo; 칸에서 볼 수 있어요.
          </p>
        </Section>

        <Section id="examples" title="2. 입출력 예 읽는 법">
          <p>
            문제 아래 표에서 왼쪽 칸들은 함수에 들어오는 <b>입력(매개변수)</b>, 마지막 <b>result</b> 칸은 return 해야
            하는 <b>정답</b>이에요.
          </p>
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse font-mono text-sm">
              <thead>
                <tr className="bg-bg-subtle text-left">
                  <th className="border border-line px-3 py-2">numbers</th>
                  <th className="border border-line px-3 py-2">result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-line px-3 py-2">[3, 1, 9, 4]</td>
                  <td className="border border-line px-3 py-2">8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            → <code>solution([3, 1, 9, 4])</code>를 호출했을 때 <code>8</code>을 return 하면 정답이라는 뜻이에요.
          </p>
        </Section>

        <Section id="run-submit" title="3. 코드 실행과 제출의 차이">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <b>코드 실행</b>: 화면에 보이는 입출력 예로만 돌려봐요. 기록은 남지 않으니 마음껏 눌러보세요.
              (단축키 ⌘/Ctrl + Enter)
            </li>
            <li>
              <b>제출 후 채점하기</b>: 보이지 않는 <b>숨은 테스트</b>까지 모두 채점해요. 아주 큰 입력이나 빈 배열 같은
              경계값이 들어 있어서, 예제는 맞아도 제출에서 틀릴 수 있어요.
            </li>
          </ul>
        </Section>

        <Section id="results" title="4. 결과 메시지 읽는 법">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <b className="font-semibold text-ok">통과</b> / <b className="font-semibold text-bad">실패</b>: 실패하면 기댓값과 내 실행 결과를
              비교해 보세요.
            </li>
            <li>
              <b>시간 초과</b>: 무한 루프가 있거나, 입력이 클 때 너무 느린 방법이에요. 이중 반복문을 줄일 방법을
              찾아보세요.
            </li>
            <li>
              <b>스택 오버플로</b>: 재귀 호출이 너무 깊어요. 반복문으로 바꾸면 대부분 해결돼요.
            </li>
            <li>
              <b>문법 오류</b>: 괄호 짝, 오타, 세미콜론 위치를 확인하세요.
            </li>
          </ul>
        </Section>


        <Section id="mistakes" title="5. 초보자가 자주 하는 실수">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              함수 이름(<code>solution</code>)이나 매개변수 이름을 바꿈
            </li>
            <li>return 없이 console.log만 함</li>
            <li>
              2차원 배열을 <code>Array(n).fill([])</code>로 만들어 모든 줄이 같은 배열을 공유함 →{" "}
              <code>{"Array.from({ length: n }, () => [])"}</code> 사용
            </li>
            <li>
              &ldquo;1,000,000,007로 나눈 나머지&rdquo; 조건을 마지막에 한 번만 적용함 → 계산할 때마다 <code>%</code>{" "}
              적용
            </li>
          </ul>
        </Section>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-bg-subtle p-6">
        <p className="font-semibold">이제 첫 문제를 풀어볼 차례예요.</p>
        <Link href="/problems" className="inline-flex h-10 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg hover:opacity-85">
          문제 목록 보기
        </Link>
      </div>
    </main>
  );
}
