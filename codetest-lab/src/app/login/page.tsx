import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authEnabled, enabledProviders, getSession, signIn } from "@/auth";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: true },
};

const safeNext = (v: unknown) => (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : "/problems");

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = safeNext(sp.callbackUrl ?? sp.next);
  if ((await getSession())?.user) redirect(next);
  const failed = typeof sp.error === "string";

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-[28px] font-semibold tracking-tight">로그인</h1>
      <p className="mt-2 leading-relaxed text-fg-muted">
        로그인하면 풀이 기록이 계정에 저장돼서 다른 기기에서도 이어서 풀 수 있어요. 로그인 전에 푼 기록도 함께
        옮겨져요.
      </p>

      {failed && (
        <p role="alert" className="mt-6 rounded-md bg-bad-soft px-3 py-2.5 text-sm text-bad">
          로그인하지 못했어요. 잠시 후 다시 시도하거나 다른 방법으로 로그인해 주세요.
        </p>
      )}

      <div className="mt-8 space-y-2.5">
        {authEnabled && enabledProviders.includes("kakao") && (
          <form
            action={async () => {
              "use server";
              await signIn("kakao", { redirectTo: next });
            }}
          >
            <button className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md bg-[#FEE500] text-[15px] font-medium text-black/85 hover:brightness-95">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  fill="#000"
                  d="M12 3C6.48 3 2 6.53 2 10.88c0 2.8 1.86 5.26 4.66 6.65l-.95 3.48c-.08.3.26.54.52.37l4.15-2.74c.53.06 1.07.1 1.62.1 5.52 0 10-3.53 10-7.86S17.52 3 12 3Z"
                />
              </svg>
              카카오로 시작하기
            </button>
          </form>
        )}
        {authEnabled && enabledProviders.includes("google") && (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: next });
            }}
          >
            <button className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-line-strong bg-white text-[15px] font-medium text-[#1f1f1f] hover:bg-[#f7f7f7]">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
              </svg>
              Google로 시작하기
            </button>
          </form>
        )}
        {!authEnabled && (
          <p className="rounded-md border border-line px-3 py-2.5 text-sm text-fg-subtle">
            지금은 로그인을 준비 중이에요. 로그인 없이도 모든 기능을 쓸 수 있어요.
          </p>
        )}
      </div>

      <p className="mt-6 text-[13px] text-fg-subtle">
        로그인하면{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          개인정보처리방침
        </Link>
        에 동의하는 것으로 봐요.
      </p>

      <p className="mt-8 text-sm text-fg-subtle">
        로그인 없이도 문제 풀이와 AI 튜터를 모두 쓸 수 있어요.{" "}
        <Link href="/problems" className="text-fg underline underline-offset-4">
          로그인 없이 계속하기
        </Link>
      </p>
    </main>
  );
}
