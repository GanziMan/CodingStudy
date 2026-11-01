# 코테랩

AI 튜터가 붙은 무료 자바스크립트 코딩테스트 연습 사이트. 회원가입 없이 누구나 이용할 수 있습니다.

- 문제 풀이: Monaco 에디터, 예제 실행 / 숨은 테스트 채점 (브라우저 Web Worker에서 실행)
- AI 튜터: 단계별 힌트(1~3), 내 코드 리뷰, 해설, AI가 직접 풀기
- AI 문제 생성: 유형·레벨 선택 → AI가 문제·테스트·정답 코드 작성 → 정답 코드로 기대값을 계산해 검증 후 저장
- 풀이 기록: 익명 쿠키 ID로 브라우저별 저장
- SEO: 페이지별 메타·canonical·OG 이미지, sitemap.xml, robots.txt, JSON-LD, 구글·네이버 소유 확인

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 입력
pnpm db:setup                # 테이블 생성 + 기본 문제 시드
pnpm dev                     # http://localhost:3000
```

스키마가 바뀌어 기존 로컬 DB에서 에러가 나면 `data/app.db`를 지우고 `pnpm db:setup`을 다시 실행하세요.

## 배포 (Turso + Vercel)

1. **Turso DB 만들기** (https://turso.tech, 무료 플랜)
   ```bash
   brew install tursodatabase/tap/turso
   turso auth login
   turso db create codetest-lab --location nrt   # 도쿄 리전
   turso db show codetest-lab --url               # → DATABASE_URL
   turso db tokens create codetest-lab            # → DATABASE_AUTH_TOKEN
   ```
2. **Turso에 테이블·문제 넣기**: `.env.local`에 위 두 값을 넣고 `pnpm db:setup`
3. **Vercel 배포** (https://vercel.com/new)
   - GitHub 레포 Import → **Root Directory를 `codetest-lab`** 으로 지정
   - Environment Variables: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `SITE_URL`
   - Deploy
4. **검색엔진 등록**
   - Google Search Console: URL 접두어로 사이트 추가 → HTML 태그의 content 값을 `GOOGLE_SITE_VERIFICATION`에 넣고 재배포 → 확인 → `sitemap.xml` 제출
   - 네이버 서치어드바이저: 사이트 등록 → HTML 태그 content 값을 `NAVER_SITE_VERIFICATION`에 넣고 재배포 → 확인 → 요청 > 사이트맵 제출

## 구조

| 경로 | 역할 |
|---|---|
| `src/lib/client-grader.ts` | 브라우저 채점기 (테스트마다 Web Worker, 3초 제한) |
| `src/lib/grader.ts` | 서버 채점기 — 시드·AI 문제의 참조 정답으로 기대 출력 계산에만 사용 |
| `src/lib/ai.ts` | Anthropic SDK 호출 (스트리밍 / tool_use) |
| `src/lib/rate-limit.ts` | AI 일일 사용 한도 (IP별·전체) |
| `src/proxy.ts` | 익명 사용자 ID 쿠키 발급 |
| `src/app/api/ai/*` | hint · review · explain · solve · generate |
| `src/app/api/submissions` | 채점 결과 기록 |
| `src/app/sitemap.ts`, `robots.ts` | 검색엔진용 |
| `scripts/seed-data.ts` | 기본 문제 |

## 운영 참고

- 사용자 코드는 서버에서 실행하지 않습니다. 대신 숨은 테스트 데이터가 브라우저로 전달되므로, 개발자 도구로 볼 수 있습니다 (연습용 사이트라 허용한 트레이드오프).
- AI 비용은 `AI_DAILY_LIMIT_*`, `GENERATE_DAILY_LIMIT_*` 로 조절하세요. Anthropic Console에서 월 사용 한도도 함께 걸어두는 것을 권장합니다.
