import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { cookies } from "next/headers";
import { db } from "@/db";
import { accounts, problems, sessions, submissions, users, verificationTokens } from "@/db/schema";
import { UID_COOKIE } from "@/lib/uid";

// 키가 설정된 로그인 수단만 켠다 (AUTH_KAKAO_ID / AUTH_GOOGLE_ID)
const providers: Provider[] = [];
if (process.env.AUTH_KAKAO_ID && process.env.AUTH_KAKAO_SECRET) providers.push(Kakao);
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) providers.push(Google);

export const enabledProviders = providers.map((p) => (typeof p === "function" ? p({}).id : p.id));

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 90 },
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  events: {
    // 로그인 전에 이 브라우저에서 남긴 풀이 기록과 만든 문제를 계정으로 옮긴다
    async signIn({ user }) {
      if (!user.id) return;
      const anon = (await cookies()).get(UID_COOKIE)?.value;
      if (!anon || anon === user.id) return;
      await db.update(submissions).set({ userId: user.id }).where(eq(submissions.userId, anon));
      await db.update(problems).set({ createdBy: user.id }).where(eq(problems.createdBy, anon));
    },
  },
});

/** 로그인이 설정됐는지 (AUTH_SECRET + 로그인 수단 1개 이상) */
export const authEnabled = !!process.env.AUTH_SECRET && providers.length > 0;

/** 설정 전에는 Auth.js를 호출하지 않아 사이트가 그대로 동작하게 한다 */
export async function getSession() {
  if (!authEnabled) return null;
  try {
    return await auth();
  } catch (e) {
    console.error("auth() failed", e);
    return null;
  }
}
