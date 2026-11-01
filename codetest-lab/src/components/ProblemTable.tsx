"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProblemSummary } from "@/lib/problems";
import { LevelBadge } from "./LevelBadge";

const STATUS = {
  solved: { label: "해결", cls: "text-ok" },
  tried: { label: "시도", cls: "text-warn" },
  new: { label: "", cls: "" },
} as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 shrink-0 rounded-full border px-3 text-[13px] transition-colors ${
        active ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export function ProblemTable({ problems }: { problems: ProblemSummary[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(problems.map((p) => p.category))], [problems]);
  const levels = useMemo(() => [...new Set(problems.map((p) => p.level))].sort(), [problems]);

  const rows = problems.filter(
    (p) =>
      (!q || p.title.includes(q.trim())) &&
      (level === null || p.level === level) &&
      (category === null || p.category === category),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">문제 검색</span>
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            aria-hidden
          >
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="문제 이름으로 검색"
            className="h-8 w-56 rounded-md border border-line bg-surface pl-8 pr-3 text-sm outline-none placeholder:text-fg-faint focus:border-line-strong"
          />
        </label>
        <div className="flex gap-1.5 overflow-x-auto">
          <Chip active={level === null} onClick={() => setLevel(null)}>
            모든 레벨
          </Chip>
          {levels.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? null : l)}>
              Lv.{l}
            </Chip>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-subtle text-left text-[13px] text-fg-subtle">
              <th className="w-16 px-4 py-2.5 font-normal">상태</th>
              <th className="px-4 py-2.5 font-normal">제목</th>
              <th className="w-24 px-4 py-2.5 font-normal">난이도</th>
              <th className="w-28 px-4 py-2.5 font-normal">유형</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="relative border-b border-line transition-colors last:border-0 hover:bg-surface-hover">
                <td className={`px-4 py-3.5 text-[13px] ${STATUS[p.status].cls}`}>{STATUS[p.status].label}</td>
                <td className="px-4 py-3.5">
                  <Link href={`/problems/${p.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                    {p.title}
                  </Link>
                  {p.source === "ai" && (
                    <span className="ml-2 rounded border border-line px-1 text-[11px] text-fg-subtle">AI 생성</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <LevelBadge level={p.level} />
                </td>
                <td className="px-4 py-3.5 text-fg-subtle">{p.category}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-14 text-center text-fg-subtle">
                  조건에 맞는 문제가 없어요. 필터를 줄이거나 다른 이름으로 검색해 보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
