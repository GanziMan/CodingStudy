# 코테랩

AI 튜터가 붙은 프로그래머스 스타일 JavaScript 코딩테스트 연습 사이트.

- 문제 풀이: Monaco 에디터, 예제 실행 / 숨김 테스트 포함 채점, 제출 기록 저장
- AI 튜터: 단계별 힌트(1~3), 내 코드 리뷰, 해설, AI가 직접 풀기(전체 테스트로 검증)
- AI 문제 생성: 유형·레벨 선택 → AI가 문제·테스트·정답 코드 작성 → 정답 코드로 기대값을 계산해 검증 후 저장

## 시작

```bash
pnpm install
cp .env.example .env.local # ANTHROPIC_API_KEY 입력
pnpm db:setup              # SQLite 테이블 생성 + 기본 문제 6개 시드
pnpm dev                   # http://localhost:3000
```

## 구조

| 경로 | 역할 |
|---|---|
| `src/lib/grader.ts` | worker_threads + vm 채점기 (테스트당 2초 제한, console.log 수집) |
| `src/lib/ai.ts` | Anthropic SDK 호출 (스트리밍 텍스트 / tool_use 구조화 응답) |
| `src/app/api/problems/[id]/{run,submit}` | 예제 실행 / 제출 채점 |
| `src/app/api/ai/*` | hint · review · explain · solve · generate |
| `src/db/schema.ts` | Drizzle 스키마 (problems, submissions) |
| `scripts/seed-data.ts` | 기본 문제. 기대 출력은 참조 풀이로 자동 계산 |

## 참고

- 채점기는 개인 로컬용이라 보안 샌드박스가 아닙니다. 외부 공개 배포 시에는 격리 실행 환경(Docker, Judge0 등)이 필요합니다.
- 에디터(Monaco)는 jsDelivr CDN에서 불러옵니다.
- 모델은 `ANTHROPIC_MODEL`로 바꿀 수 있습니다.
