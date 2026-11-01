"use client";

import { setThemePref, useThemePref, type ThemePref } from "./theme";

const OPTIONS: { value: ThemePref; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "라이트 모드",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "시스템 설정 따르기",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
        <path d="M5.5 14h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "다크 모드",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const pref = useThemePref();
  return (
    <div role="radiogroup" aria-label="화면 테마" className="flex h-8 items-center rounded-full border border-line p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={pref === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => setThemePref(o.value)}
          className={`flex h-[26px] w-[26px] items-center justify-center rounded-full transition-colors ${
            pref === o.value ? "bg-surface-hover text-fg" : "text-fg-subtle hover:text-fg"
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
