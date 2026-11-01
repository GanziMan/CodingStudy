import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { aiUsage } from "@/db/schema";

type Kind = "ai" | "generate" | "login" | "submit";

const num = (v: string | undefined, d: number) => (v && Number(v) > 0 ? Number(v) : d);

// 공개 서비스에서 API 비용이 무한정 나가지 않도록 하는 일일 한도
const LIMITS: Record<Kind, { perIp: number; global: number }> = {
  ai: {
    perIp: num(process.env.AI_DAILY_LIMIT_PER_IP, 30),
    global: num(process.env.AI_DAILY_LIMIT_GLOBAL, 1000),
  },
  generate: {
    perIp: num(process.env.GENERATE_DAILY_LIMIT_PER_IP, 3),
    global: num(process.env.GENERATE_DAILY_LIMIT_GLOBAL, 50),
  },
  login: { perIp: 20, global: 200 },
  submit: { perIp: 300, global: 20000 },
};

const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());

async function bump(key: string, kind: Kind, day: string) {
  const [row] = await db
    .insert(aiUsage)
    .values({ key, kind, day, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.key, aiUsage.kind, aiUsage.day],
      set: { count: sql`${aiUsage.count} + 1` },
    })
    .returning({ count: aiUsage.count });
  return row.count;
}

async function undo(key: string, kind: Kind, day: string) {
  await db
    .update(aiUsage)
    .set({ count: sql`max(${aiUsage.count} - 1, 0)` })
    .where(and(eq(aiUsage.key, key), eq(aiUsage.kind, kind), eq(aiUsage.day, day)));
}

async function cleanup(today: string) {
  const d = new Date(today);
  d.setDate(d.getDate() - 7);
  const cutoff = d.toISOString().slice(0, 10);
  await db.delete(aiUsage).where(lt(aiUsage.day, cutoff));
}

/** 한도 안이면 사용량을 1 올리고 null, 넘으면 사용자에게 보여줄 메시지 */
export async function consume(ip: string, kind: Kind): Promise<string | null> {
  const day = today();
  const limit = LIMITS[kind];
  const label = { ai: "AI 튜터", generate: "AI 문제 만들기", login: "로그인 시도", submit: "제출" }[kind];

  // 오래된 집계 행은 가끔 정리한다 (테이블이 무한히 자라지 않게)
  if (Math.random() < 0.02) void cleanup(day).catch(() => {});
  const mine = await bump(`ip:${ip}`, kind, day);
  if (mine > limit.perIp) {
    await undo(`ip:${ip}`, kind, day);
    return `오늘 ${label} 사용 횟수(${limit.perIp}회)를 모두 썼어요. 내일 다시 이용해 주세요.`;
  }
  const all = await bump("global", kind, day);
  if (all > limit.global) {
    await undo("global", kind, day);
    await undo(`ip:${ip}`, kind, day);
    return `오늘 사이트 전체 ${label} 사용량이 많아 잠시 쉬어가요. 내일 다시 이용해 주세요.`;
  }
  return null;
}
