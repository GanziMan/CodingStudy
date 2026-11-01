"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";


export default function GeneratePage() {
  const router = useRouter();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("DP");
  const [level, setLevel] = useState(2);
  const [request, setRequest] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, level, request: request.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/problems/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm ${active ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">AI로 새 문제 만들기</h1>
      <p className="mt-1 text-sm text-muted">
        유형과 난이도만 고르면 AI가 새 문제와 테스트를 만들어요. 정답 코드로 테스트를 직접 검증한 뒤 저장하고,
        만든 문제는 모든 사람이 함께 풀 수 있어요. (하루 3개까지)
      </p>

      <form onSubmit={submit} className="mt-8 space-y-7 rounded-xl border border-line bg-surface p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">유형</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button type="button" key={c} className={chip(category === c)} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">난이도</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((l) => (
              <button type="button" key={l} className={chip(level === l)} onClick={() => setLevel(l)}>
                Lv.{l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            추가 요청 <span className="font-normal text-muted">(선택)</span>
          </label>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="예: 계단 오르기 변형인데 최댓값을 구하는 문제로 / 2차원 배열 DP 연습용으로"
            className="w-full rounded-md border border-line p-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && <p className="rounded-md bg-bad/10 p-3 text-sm text-bad">{error}</p>}

        <button
          disabled={busy}
          className="h-11 w-full rounded-md bg-accent font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "문제 만드는 중… (30초~1분)" : "문제 만들기"}
        </button>
      </form>
    </main>
  );
}
