import type { PublicProblem } from "@/lib/problems";
import { Markdown } from "../Markdown";

export function ProblemPane({ problem }: { problem: PublicProblem }) {
  return (
    <div className="p-6">
      <Markdown dark>{problem.description}</Markdown>

      <h3 className="mt-8 mb-3 font-bold">입출력 예</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[13px]">
          <thead>
            <tr className="bg-white/5 text-left">
              {problem.params.map((p) => (
                <th key={p} className="border border-panel-line px-3 py-2 font-semibold">{p}</th>
              ))}
              <th className="border border-panel-line px-3 py-2 font-semibold">result</th>
            </tr>
          </thead>
          <tbody>
            {problem.examples.map((ex, i) => (
              <tr key={i}>
                {ex.input.map((v, j) => (
                  <td key={j} className="border border-panel-line px-3 py-2">{JSON.stringify(v)}</td>
                ))}
                <td className="border border-panel-line px-3 py-2">{JSON.stringify(ex.output)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-white/40">
        제출 시 숨겨진 테스트를 포함해 총 {problem.tests.length}개로 채점합니다.
      </p>
    </div>
  );
}
