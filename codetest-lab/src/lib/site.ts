const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const SITE = {
  name: "코테랩",
  url: (process.env.SITE_URL || vercelUrl || "http://localhost:3000").replace(/\/$/, ""),
  title: "코테랩 - 무료 자바스크립트 코딩테스트 연습",
  description:
    "자바스크립트 코딩테스트를 무료로 연습하세요. 설치·회원가입 없이 브라우저에서 바로 코드를 실행하고, 숨은 테스트까지 채점받을 수 있어요. DP·구현 등 입문자도 쉽게 시작할 수 있는 레벨별 문제와 이용 가이드를 제공합니다.",
  keywords: [
    "코딩테스트",
    "코딩테스트 연습",
    "자바스크립트 코딩테스트",
    "JavaScript 알고리즘",
    "알고리즘 문제",
    "코테 준비",
    "DP 문제",
    "동적계획법",
    "다이나믹 프로그래밍",
    "코딩테스트 입문",
    "코딩테스트 채점",
    "프로그래머스 연습",
    "취업 코딩테스트",
  ],
};

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** 페이지별 openGraph는 루트 값을 통째로 덮어쓰므로 공통 필드를 함께 넣는다 */
export const OG_BASE = {
  locale: "ko_KR",
  siteName: SITE.name,
  images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.title }],
};
