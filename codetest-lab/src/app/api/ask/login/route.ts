import { jsonError } from "@/lib/http";
import { OWNER_COOKIE, checkPassword, ownerConfigured, ownerToken } from "@/lib/owner";
import { consume } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/user";

export async function POST(req: Request) {
  if (!ownerConfigured()) return jsonError("OWNER_PASSWORD가 설정되지 않았어요.", 503);
  // 비밀번호 대입 공격을 막기 위해 IP당 하루 시도 횟수를 제한
  const limited = await consume(await getClientIp(), "login");
  if (limited) return jsonError("시도 횟수가 너무 많아요. 내일 다시 시도해 주세요.", 429);

  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !checkPassword(body.password)) {
    return jsonError("비밀번호가 맞지 않아요.", 401);
  }
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `${OWNER_COOKIE}=${ownerToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 180}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return res;
}
