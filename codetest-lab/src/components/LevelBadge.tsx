const COLORS = ["", "#2ec27e", "#2b9af3", "#f0a020", "#e5484d", "#9b5cf6"];

export function LevelBadge({ level }: { level: number }) {
  const c = COLORS[level] ?? "#6b7a89";
  return (
    <span
      className="inline-flex h-6 items-center rounded px-2 text-xs font-semibold"
      style={{ color: c, background: `${c}1f` }}
    >
      Lv.{level}
    </span>
  );
}
