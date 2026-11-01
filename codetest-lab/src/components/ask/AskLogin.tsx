"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AskLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/ask/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error ?? "열지 못했어요.");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">질문하기</h1>
      <p className="mt-2 text-fg-muted">주인 전용 페이지예요. 비밀번호를 입력해 주세요.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block">
          <span className="sr-only">비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-md border border-line bg-surface px-3 outline-none focus:border-line-strong"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-bad">
            {error}
          </p>
        )}
        <button
          disabled={busy || !password}
          className="h-10 w-full rounded-md bg-fg text-sm font-medium text-bg hover:opacity-85 disabled:opacity-50"
        >
          {busy ? "확인하는 중" : "열기"}
        </button>
      </form>
    </main>
  );
}
