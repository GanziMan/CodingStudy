export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <rect width="24" height="24" rx="6" fill="currentColor" />
        <path
          d="M9.5 8 5.5 12l4 4M14.5 8l4 4-4 4"
          fill="none"
          stroke="var(--bg)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">코테랩</span>
    </span>
  );
}
