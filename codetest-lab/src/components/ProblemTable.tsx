"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProblemSummary } from "@/lib/problems";
import { LevelBadge } from "./LevelBadge";

const STATUS = {
  solved: { label: "해결", cls: "text-ok" },
  tried: { label: "시도", cls: "text-[#f0a020]" },
  new: { label: "", cls: "" },
} as const;

export function ProblemTable({ problems }: { problems: ProblemSummary[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(problems.map((p) => p.category))], [problems]);
  const levels = useMemo(() => [...new Set(problems.map((p) => p.level))].sort(), [problems]);

  const rows = problems.filter(
    (p) =>
      (!q || p.title.includes(q)) &&
      (level === null || p.level === level) &&
      (category === null || p.category === category),
  );

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${active ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink hover:border-accent"}`;

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="문제 검색"
          className="h-9 w-48 rounded-md border border-line px-3 text-sm outline-none focus:border-accent"
        />
        <span className="mx-2 h-5 w-px bg-line" />
        <button className={chip(level === null)} onClick={() => setLevel(null)}>전체</button>
        {levels.map((l) => (
          <button key={l} className={chip(level === l)} onClick={() => setLevel(level === l ? null : l)}>
            Lv.{l}
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-line" />
        {categories.map((c) => (
          <button key={c} className={chip(category === c)} onClick={() => setCategory(category === c ? null : c)}>
            {c}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-muted">
          <tr className="border-b border-line">
            <th className="w-16 px-4 py-3 font-medium">상태</th>
            <th className="px-4 py-3 font-medium">제목</th>
            <th className="w-24 px-4 py-3 font-medium">난이도</th>
            <th className="w-24 px-4 py-3 font-medium">유형</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-line last:border-0 hover:bg-bg">
              <td className={`px-4 py-3 font-semibold ${STATUS[p.status].cls}`}>{STATUS[p.status].label}</td>
              <td className="px-4 py-3">
                <Link href={`/problems/${p.id}`} className="font-medium hover:text-accent">
                  {p.title}
                </Link>
                {p.source === "ai" && (
                  <span className="ml-2 rounded bg-[#9b5cf6]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#9b5cf6]">
                    AI
                  </span>
                )}
              </td>
              <td className="px-4 py-3"><LevelBadge level={p.level} /></td>
              <td className="px-4 py-3 text-muted">{p.category}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-muted">조건에 맞는 문제가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
