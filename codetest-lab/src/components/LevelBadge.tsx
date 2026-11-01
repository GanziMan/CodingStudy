// 레벨은 색 하나로만 구분하지 않고 숫자를 함께 표시한다
const TONE: Record<number, string> = {
  1: "text-ok bg-ok-soft",
  2: "text-accent bg-accent-soft",
  3: "text-warn bg-warn-soft",
  4: "text-bad bg-bad-soft",
  5: "text-fg bg-surface-hover",
};

export function LevelBadge({ level }: { level: number }) {
  return (
    <span
      className={`inline-flex h-[22px] items-center rounded-md px-1.5 font-mono text-[12px] font-medium ${TONE[level] ?? TONE[5]}`}
    >
      Lv.{level}
    </span>
  );
}
