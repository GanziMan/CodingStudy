import { cookies, headers } from "next/headers";
import { getSession } from "@/auth";
import { UID_COOKIE } from "./uid";

export { UID_COOKIE };

/**
 * 기록을 묶는 사용자 ID.
 * 로그인했으면 계정 ID, 아니면 proxy.ts가 발급한 익명 쿠키 ID (첫 요청 등으로 없으면 null)
 */
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  if (session?.user?.id) return session.user.id;
  const v = (await cookies()).get(UID_COOKIE)?.value;
  return v && /^[\w-]{10,64}$/.test(v) ? v : null;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
