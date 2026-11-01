"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/problems", label: "문제" },
  { href: "/guide", label: "이용 가이드" },
  { href: "/generate", label: "문제 만들기" },
  { href: "/history", label: "내 기록" },
];

export function SiteNav({ owner = false }: { owner?: boolean }) {
  const path = usePathname();
  const items = owner ? [...NAV, { href: "/ask", label: "질문하기" }] : NAV;
  return (
    <nav aria-label="주요 메뉴" className="flex min-w-0 items-center gap-1 overflow-x-auto">
      {items.map((n) => {
        const active = path === n.href || path.startsWith(`${n.href}/`);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
              active ? "text-fg" : "text-fg-subtle hover:bg-surface-hover hover:text-fg"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
