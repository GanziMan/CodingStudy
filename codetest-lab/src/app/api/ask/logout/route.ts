import { OWNER_COOKIE } from "@/lib/owner";

export async function POST() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", `${OWNER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return res;
}
