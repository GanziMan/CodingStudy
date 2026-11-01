import { cookies, headers } from "next/headers";
import { UID_COOKIE } from "./uid";

export { UID_COOKIE };

/** proxy.ts가 발급한 익명 사용자 ID. 첫 요청 등으로 아직 없으면 null */
export async function getUserId(): Promise<string | null> {
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
