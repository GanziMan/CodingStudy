import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-lg font-semibold tracking-tight">{children}</h2>
);

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 leading-relaxed text-fg-muted sm:px-6">
      <h1 className="text-[28px] font-semibold tracking-tight text-fg">개인정보처리방침</h1>
      <p className="mt-3">
        코테랩(이하 &ldquo;서비스&rdquo;)은 이용자의 개인정보를 소중히 다루며, 서비스 운영에 꼭 필요한 정보만 처리합니다.
      </p>

      <H>1. 처리하는 개인정보</H>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>서비스 이용 시: 제출한 코드와 채점 결과, AI 튜터에 보낸 코드, 브라우저 식별용 쿠키, 접속 IP(이용 한도 계산용)</li>
      </ul>

      <H>2. 처리 목적</H>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>풀이 기록 저장·조회</li>
        <li>AI 힌트·해설·코드 리뷰 제공</li>
        <li>부정 이용 방지와 일일 이용 한도 관리</li>
      </ul>

      <H>3. 보유 기간</H>
      <p className="mt-3">
        풀이 기록은 삭제 요청 시까지 보관하고, 요청을 받으면 지체 없이 삭제합니다. 이용 한도 계산용
        IP 기록은 일 단위로 집계되며 목적 달성 후 삭제합니다.
      </p>

      <H>4. 처리 위탁 및 국외 이전</H>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>Vercel Inc.(미국): 웹 호스팅</li>
        <li>Turso(ChiselStrike Inc., 미국): 데이터베이스 저장</li>
        <li>Anthropic PBC(미국): AI 튜터 응답 생성. AI 튜터 요청 시 문제와 이용자가 보낸 코드가 전송됩니다.</li>
      </ul>

      <H>5. 이용자의 권리</H>
      <p className="mt-3">
        이용자는 언제든지 자신의 개인정보 열람·정정·삭제를 요청할 수 있습니다. 아래 연락처로 요청해 주세요.
      </p>

      <H>6. 문의</H>
      <p className="mt-3">
        개인정보 관련 문의:{" "}
        <a href="https://github.com/GanziMan/codingstudy/issues" className="text-fg underline underline-offset-4">
          GitHub 이슈
        </a>
      </p>

      <p className="mt-10 text-sm text-fg-subtle">시행일: 2026년 11월 1일</p>
    </main>
  );
}
