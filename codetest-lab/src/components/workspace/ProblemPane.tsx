import type { PublicProblem } from "@/lib/problems";
import { Markdown } from "../Markdown";

export function ProblemPane({ problem }: { problem: PublicProblem }) {
  return (
    <div className="px-6 py-6">
      <h2 className="sr-only">문제 설명</h2>
      <Markdown>{problem.description}</Markdown>

      <h3 className="mb-3 mt-9 text-[15px] font-semibold">입출력 예</h3>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse font-mono text-[13px]">
          <thead>
            <tr className="bg-bg-subtle text-left text-fg-subtle">
              {problem.params.map((p) => (
                <th key={p} className="border-b border-line px-3 py-2 font-normal">
                  {p}
                </th>
              ))}
              <th className="border-b border-line px-3 py-2 font-normal">result</th>
            </tr>
          </thead>
          <tbody>
            {problem.examples.map((ex, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {ex.input.map((v, j) => (
                  <td key={j} className="px-3 py-2">
                    {JSON.stringify(v)}
                  </td>
                ))}
                <td className="px-3 py-2">{JSON.stringify(ex.output)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-fg-subtle">
        제출하면 숨은 테스트를 포함해 모두 {problem.tests.length}개로 채점해요.
      </p>
    </div>
  );
}
