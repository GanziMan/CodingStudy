export type SeedProblem = {
  title: string;
  level: number;
  category: string;
  description: string;
  params: string[];
  exampleInputs: unknown[][];
  hiddenInputs: unknown[][];
  reference: string;
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const seedProblems: SeedProblem[] = [
  {
    title: "최댓값과 최솟값의 차이",
    level: 1,
    category: "구현",
    params: ["numbers"],
    description: `정수 배열 \`numbers\`가 주어집니다. 배열에서 가장 큰 수와 가장 작은 수의 차이를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`numbers\`의 길이 ≤ 100,000
- -1,000,000 ≤ \`numbers\`의 원소 ≤ 1,000,000

### 입출력 예 설명
첫 번째 예: 최댓값 9, 최솟값 1 → 8`,
    exampleInputs: [[[3, 1, 9, 4]], [[5]]],
    hiddenInputs: [
      [[-3, -7, -1]],
      [[1000000, -1000000]],
      [range(100000).map((i) => (i * 7919) % 200001 - 100000)],
    ],
    reference: `function solution(numbers) {
  let max = -Infinity, min = Infinity;
  for (const x of numbers) { if (x > max) max = x; if (x < min) min = x; }
  return max - min;
}`,
  },
  {
    title: "계단 오르기",
    level: 2,
    category: "DP",
    params: ["n"],
    description: `계단이 \`n\`칸 있고, 바닥에서 출발해 꼭대기(n번째 칸)까지 올라가려 합니다. 한 번에 **1칸** 또는 **2칸**씩 오를 수 있습니다.

꼭대기까지 올라가는 방법의 수를 **1,000,000,007**로 나눈 나머지를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`n\` ≤ 100,000

### 입출력 예 설명
n = 3일 때: (1+1+1), (1+2), (2+1) → 3가지`,
    exampleInputs: [[3], [4]],
    hiddenInputs: [[1], [2], [10], [50], [1000], [100000]],
    reference: `function solution(n) {
  const MOD = 1_000_000_007;
  const dp = [0, 1, 2];
  for (let i = dp.length; i <= n; i++) dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
  return dp[n];
}`,
  },
  {
    title: "징검다리 건너기",
    level: 2,
    category: "DP",
    params: ["n"],
    description: `강에 돌이 1번부터 \`n\`번까지 일렬로 놓여 있습니다. 개구리는 출발점(0번)에서 시작해 n번 돌까지 가려고 합니다.

개구리는 한 번 뛸 때 **1칸** 또는 **3칸**만 뛸 수 있습니다. (2칸은 못 뜀)

n번 돌까지 가는 방법의 수를 **1,000,000,007**로 나눈 나머지를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`n\` ≤ 100,000

### 입출력 예 설명
n = 4일 때: (1+1+1+1), (1+3), (3+1) → 3가지`,
    exampleInputs: [[4], [6]],
    hiddenInputs: [[1], [2], [3], [5], [30], [5000], [100000]],
    reference: `function solution(n) {
  const MOD = 1_000_000_007;
  const dp = [0, 1, 1, 2];
  for (let i = dp.length; i <= n; i++) dp[i] = (dp[i - 1] + dp[i - 3]) % MOD;
  return dp[n];
}`,
  },
  {
    title: "체력 아끼며 계단 오르기",
    level: 2,
    category: "DP",
    params: ["cost"],
    description: `계단이 1번부터 n번까지 있고, 각 칸을 밟을 때마다 체력이 소모됩니다. 시작은 0번(바닥)이고, 바닥에서는 체력이 들지 않습니다.

한 번에 **1칸** 또는 **2칸**씩 오를 수 있습니다. n번째 칸에 도착할 때까지 소모하는 **체력의 최솟값**을 return 하는 \`solution\` 함수를 완성하세요.

\`cost[i]\`는 **(i+1)번째 칸**을 밟을 때 드는 체력입니다. n은 \`cost.length\`입니다.

### 제한사항
- 1 ≤ \`cost.length\` ≤ 100,000
- 1 ≤ \`cost[i]\` ≤ 1,000

### 입출력 예 설명
첫 번째 예: 0 → 2번 칸(1) → 4번 칸(2) = 3`,
    exampleInputs: [[[3, 1, 4, 2]], [[10, 15, 20]]],
    hiddenInputs: [
      [[5]],
      [[7, 2]],
      [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]],
      [range(100000).map((i) => ((i * 37) % 1000) + 1)],
    ],
    reference: `function solution(cost) {
  const n = cost.length;
  const dp = [0, cost[0]];
  for (let i = dp.length; i <= n; i++) dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i - 1];
  return dp[n];
}`,
  },
  {
    title: "부서진 계단",
    level: 2,
    category: "DP",
    params: ["n", "broken"],
    description: `계단이 1번부터 \`n\`번까지 있고, 바닥(0번)에서 출발해 n번째 칸까지 올라가려 합니다. 한 번에 **1칸** 또는 **2칸**씩 오를 수 있습니다.

그런데 일부 칸이 부서져 있어서 **그 칸은 밟을 수 없습니다.** (건너뛰는 건 가능)

부서진 칸 번호가 담긴 배열 \`broken\`이 주어질 때, n번째 칸까지 가는 방법의 수를 **1,000,000,007**로 나눈 나머지를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 3 ≤ \`n\` ≤ 100,000
- 1번, 2번, n번 칸은 부서져 있지 않습니다.
- \`broken\`의 원소는 중복되지 않습니다.

### 입출력 예 설명
첫 번째 예: 3번 칸을 못 밟으니 (1→2→4→5), (2→4→5) 2가지`,
    exampleInputs: [[5, [3]], [6, [4]], [6, [3, 4]]],
    hiddenInputs: [
      [3, []],
      [10, [5, 8]],
      [20, [3, 6, 9, 12, 15, 18]],
      [100000, range(3000).map((i) => i * 31 + 3).filter((x) => x < 100000)],
    ],
    reference: `function solution(n, broken) {
  const MOD = 1_000_000_007;
  const bad = new Set(broken);
  const dp = [0, 1, 2];
  for (let i = dp.length; i <= n; i++) {
    dp[i] = bad.has(i) ? 0 : (dp[i - 1] + dp[i - 2]) % MOD;
  }
  return dp[n];
}`,
  },
  {
    title: "웅덩이 피해 가기",
    level: 3,
    category: "DP",
    params: ["m", "n", "puddles"],
    description: `가로 \`m\`, 세로 \`n\` 크기의 격자 지도가 있습니다. 왼쪽 위 (1, 1)에서 출발해 오른쪽 아래 (m, n)까지 가려 합니다. 이동은 **오른쪽** 또는 **아래쪽**으로 한 칸씩만 가능합니다.

일부 칸에는 웅덩이가 있어 지나갈 수 없습니다. 웅덩이 좌표 배열 \`puddles\`의 각 원소는 \`[x, y]\` 형태입니다.

도착점까지 가는 경로의 수를 **1,000,000,007**로 나눈 나머지를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`m\`, \`n\` ≤ 100 (단, m = n = 1인 경우는 없음)
- 출발점과 도착점에는 웅덩이가 없습니다.
- 0 ≤ \`puddles\`의 길이 ≤ 10

### 입출력 예 설명
첫 번째 예: 3×3 지도에서 웅덩이 없이 가는 경로는 6가지`,
    exampleInputs: [[3, 3, []], [4, 3, [[2, 2]]]],
    hiddenInputs: [
      [2, 1, []],
      [3, 3, [[2, 1], [1, 2]]],
      [5, 5, [[3, 3]]],
      [100, 100, [[50, 50], [20, 70], [70, 20]]],
    ],
    reference: `function solution(m, n, puddles) {
  const MOD = 1_000_000_007;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const bad = new Set(puddles.map(([x, y]) => x + "," + y));
  dp[1][1] = 1;
  for (let y = 1; y <= n; y++) {
    for (let x = 1; x <= m; x++) {
      if (x === 1 && y === 1) continue;
      dp[y][x] = bad.has(x + "," + y) ? 0 : (dp[y - 1][x] + dp[y][x - 1]) % MOD;
    }
  }
  return dp[n][m];
}`,
  },
];
