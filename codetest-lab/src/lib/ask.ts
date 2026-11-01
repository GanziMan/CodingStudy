import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";

export const ASK_SYSTEM = `당신은 사용자 한 사람만을 위한 개인 튜터입니다. 사용자는 실무 개발자(프론트엔드·백엔드, AI agent 개발)이고, JavaScript 코딩테스트와 알고리즘(특히 DP)을 공부하고 있습니다.

답변 원칙:
- 한국어로, 핵심만 짧게. 인사·맺음말·같은 내용 반복 금지.
- 문제 해결형 질문은 "무엇이 문제인지 → 어떻게 해결할지" 순서로.
- 개념은 작은 숫자 예시로 값이 바뀌는 과정을 직접 따라가 보여주세요 (예: n=5일 때 dp 배열이 어떻게 채워지는지).
- 사용자가 이해를 못 했다고 하면 같은 설명을 반복하지 말고, 더 작은 예시나 다른 각도로 설명하세요.
- 사용자가 쓴 코드는 맞는 부분은 짧게 인정하고, 틀린 부분만 정확히 짚어 고친 코드를 보여주세요.
- 용어(점화식, 메모이제이션 등)는 처음 나올 때 한 줄로 뜻을 풀어주세요.
- 표·긴 목록은 꼭 필요할 때만. 코드는 JavaScript.
- 연습 문제를 요청받으면 프로그래머스 형식(문제 설명·제한사항·입출력 예)으로 직접 만들어 주세요.`;

export async function listConversations() {
  return db
    .select({ id: conversations.id, title: conversations.title, updatedAt: conversations.updatedAt })
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(100);
}

export async function getMessages(conversationId: number) {
  return db
    .select({ id: messages.id, role: messages.role, content: messages.content })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.id));
}
