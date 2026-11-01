"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">잠시 문제가 생겼어요</h1>
      <p className="mt-3 leading-relaxed text-fg-muted">
        페이지를 불러오지 못했어요. 다시 시도해도 안 되면 잠시 후에 열어주세요.
      </p>
      <div className="mt-8 flex gap-2">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg hover:opacity-85"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 text-sm font-medium hover:bg-surface-hover"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
