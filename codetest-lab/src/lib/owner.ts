import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 사이트 주인만 쓰는 /ask 페이지 잠금. OWNER_PASSWORD 환경변수가 비밀번호.
export const OWNER_COOKIE = "ctl_owner";

const tokenFor = (password: string) =>
  createHash("sha256").update(`ctl-owner:${password}`).digest("hex");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const ownerConfigured = () => !!process.env.OWNER_PASSWORD;

export function checkPassword(input: string) {
  const pw = process.env.OWNER_PASSWORD;
  return !!pw && same(tokenFor(input), tokenFor(pw));
}

export function ownerToken() {
  return tokenFor(process.env.OWNER_PASSWORD ?? "");
}

export async function isOwner() {
  const pw = process.env.OWNER_PASSWORD;
  if (!pw) return false;
  const v = (await cookies()).get(OWNER_COOKIE)?.value;
  return !!v && same(v, tokenFor(pw));
}
