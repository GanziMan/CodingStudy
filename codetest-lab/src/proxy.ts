import { NextResponse, type NextRequest } from "next/server";

import { UID_COOKIE } from "./lib/uid";

// 로그인 없이 쓰도록 익명 ID 쿠키를 발급 (풀이 기록 구분용)
export function proxy(request: NextRequest) {
  if (request.cookies.has(UID_COOKIE)) return NextResponse.next();

  const id = crypto.randomUUID();
  // 같은 요청의 서버 렌더링에서도 바로 읽을 수 있게 요청 쿠키에도 넣는다
  request.cookies.set(UID_COOKIE, id);
  const res = NextResponse.next({ request });
  res.cookies.set(UID_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|og.png|robots.txt|sitemap.xml).*)"],
};
