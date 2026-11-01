// 첫 화면의 문제 풀이 화면 미리보기 (정적). 실제 워크스페이스와 같은 토큰을 쓴다.
const CODE: { t: string; c?: string }[][] = [
  [{ t: "function ", c: "k" }, { t: "solution", c: "f" }, { t: "(n) {" }],
  [{ t: "  const ", c: "k" }, { t: "dp = [" }, { t: "0", c: "n" }, { t: ", " }, { t: "1", c: "n" }, { t: ", " }, { t: "2", c: "n" }, { t: "];" }],
  [{ t: "  for ", c: "k" }, { t: "(" }, { t: "let ", c: "k" }, { t: "i = " }, { t: "3", c: "n" }, { t: "; i <= n; i++) {" }],
  [{ t: "    dp[i] = dp[i-" }, { t: "1", c: "n" }, { t: "] + dp[i-" }, { t: "2", c: "n" }, { t: "];" }],
  [{ t: "  }" }],
  [{ t: "  return ", c: "k" }, { t: "dp[n];" }],
  [{ t: "}" }],
];

const TONE: Record<string, string> = {
  k: "text-[#cf2c9b] dark:text-[#f075c8]",
  f: "text-[#7c3aed] dark:text-[#b38cff]",
  n: "text-accent",
};

export function HeroPreview() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-line bg-surface text-[13px] shadow-[0_1px_0_var(--line),0_12px_32px_-16px_rgb(0_0_0/0.18)]"
    >
      <div className="flex h-10 items-center gap-2 border-b border-line px-4">
        <span className="font-medium">계단 오르기</span>
        <span className="rounded-md bg-accent-soft px-1.5 font-mono text-[11px] text-accent">Lv.2</span>
        <span className="ml-auto font-mono text-[11px] text-fg-faint">solution.js</span>
      </div>
      <div className="grid sm:grid-cols-[1.25fr_1fr]">
        <pre className="overflow-x-auto border-b border-line bg-code px-4 py-4 font-mono text-[12.5px] leading-[1.75] sm:border-r sm:border-b-0">
          {CODE.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-6 shrink-0 select-none text-fg-faint">{i + 1}</span>
              <span className="whitespace-pre">
                {line.map((s, j) => (
                  <span key={j} className={s.c ? TONE[s.c] : undefined}>
                    {s.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
        <div className="flex flex-col gap-3 p-4">
          <div className="space-y-1.5 font-mono text-[12px]">
            {[
              ["테스트 1", "통과"],
              ["테스트 2", "통과"],
              ["숨은 테스트 6개", "통과"],
            ].map(([a, b]) => (
              <div key={a} className="flex items-center justify-between">
                <span className="text-fg-subtle">{a}</span>
                <span className="text-ok">{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-lg bg-ok-soft p-3 leading-relaxed">
            <p className="font-medium text-ok">정답이에요</p>
            <p className="mt-0.5 text-[12px] text-ok/80">8 / 8 통과</p>
          </div>
        </div>
      </div>
    </div>
  );
}
