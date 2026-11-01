import type { SeedProblem } from "./seed-data";

// 테스트 입력을 재현 가능하게 만들기 위한 간단한 난수 (seed 고정)
const rng = (seed: number) => {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
};
const ints = (n: number, lo: number, hi: number, seed: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => lo + Math.floor(r() * (hi - lo + 1)));
};
const word = (n: number, seed: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(r() * 26))).join("");
};

export const moreProblems: SeedProblem[] = [
  // ---------------- Lv.1 ----------------
  {
    title: "짝수만 더하기",
    level: 1,
    category: "구현",
    params: ["numbers"],
    description: `정수 배열 \`numbers\`가 주어집니다. 배열에서 **짝수인 원소들의 합**을 return 하는 \`solution\` 함수를 완성하세요. 짝수가 하나도 없으면 0을 return 합니다.

### 제한사항
- 1 ≤ \`numbers\`의 길이 ≤ 10,000
- -1,000 ≤ \`numbers\`의 원소 ≤ 1,000

### 입출력 예 설명
첫 번째 예: 짝수는 2, 4 → 합 6`,
    exampleInputs: [[[1, 2, 3, 4, 5]], [[1, 3, 5]]],
    hiddenInputs: [[[0]], [[-2, -4, 7]], [[2]], [ints(5000, -1000, 1000, 11)]],
    reference: `function solution(numbers) {
  let sum = 0;
  for (const x of numbers) if (x % 2 === 0) sum += x;
  return sum;
}`,
  },
  {
    title: "자릿수의 합",
    level: 1,
    category: "구현",
    params: ["n"],
    description: `자연수 \`n\`이 주어집니다. \`n\`의 **각 자릿수를 모두 더한 값**을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`n\` ≤ 1,000,000,000

### 입출력 예 설명
n = 1234 → 1 + 2 + 3 + 4 = 10`,
    exampleInputs: [[1234], [7]],
    hiddenInputs: [[10], [999999999], [1000000000], [305]],
    reference: `function solution(n) {
  let sum = 0;
  while (n > 0) { sum += n % 10; n = Math.floor(n / 10); }
  return sum;
}`,
  },
  {
    title: "가장 많이 나온 글자",
    level: 1,
    category: "해시",
    params: ["s"],
    description: `알파벳 소문자로만 이루어진 문자열 \`s\`가 주어집니다. 가장 많이 등장한 글자를 return 하는 \`solution\` 함수를 완성하세요. 가장 많이 등장한 글자가 여러 개면 **알파벳 순으로 가장 앞선 글자**를 return 합니다.

### 제한사항
- 1 ≤ \`s\`의 길이 ≤ 100,000

### 입출력 예 설명
"banana"는 a가 3번으로 가장 많음`,
    exampleInputs: [["banana"], ["abcabc"]],
    hiddenInputs: [["z"], ["zzzaaa"], [word(30000, 5)], ["qwertyuiop"]],
    reference: `function solution(s) {
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);
  let best = "", bestCount = 0;
  for (const [ch, c] of count) {
    if (c > bestCount || (c === bestCount && ch < best)) { best = ch; bestCount = c; }
  }
  return best;
}`,
  },
  {
    title: "약수의 개수",
    level: 1,
    category: "구현",
    params: ["n"],
    description: `자연수 \`n\`의 **약수의 개수**를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`n\` ≤ 1,000,000,000

### 입출력 예 설명
12의 약수는 1, 2, 3, 4, 6, 12 → 6개

n이 크므로 1부터 n까지 전부 나눠보면 시간 초과가 납니다. 약수는 짝을 지어 나타난다는 점을 이용해 보세요.`,
    exampleInputs: [[12], [7]],
    hiddenInputs: [[1], [36], [1000000000], [999999937], [720720]],
    reference: `function solution(n) {
  let count = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) count += i * i === n ? 1 : 2;
  }
  return count;
}`,
  },
  {
    title: "두 수의 합 찾기",
    level: 1,
    category: "해시",
    params: ["numbers", "target"],
    description: `정수 배열 \`numbers\`와 정수 \`target\`이 주어집니다. 배열에서 **서로 다른 위치의 두 수를 골라 더해서 \`target\`을 만들 수 있으면 true, 없으면 false**를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 2 ≤ \`numbers\`의 길이 ≤ 100,000
- -1,000,000 ≤ \`numbers\`의 원소, \`target\` ≤ 1,000,000

### 입출력 예 설명
첫 번째 예: 2 + 7 = 9

이중 반복문은 길이가 10만일 때 시간 초과가 납니다. 지금까지 본 수를 기억해 두는 방법을 생각해 보세요.`,
    exampleInputs: [[[2, 7, 11, 15], 9], [[1, 2, 3], 7]],
    hiddenInputs: [
      [[5, 5], 10],
      [[5], 10],
      [[3, 3], 6],
      [[4], 8],
      [ints(20000, -1000000, 1000000, 21), 1234567],
      [[...ints(19998, 1, 100, 22), -500000, 500000], 0],
    ],
    reference: `function solution(numbers, target) {
  const seen = new Set();
  for (const x of numbers) {
    if (seen.has(target - x)) return true;
    seen.add(x);
  }
  return false;
}`,
  },

  // ---------------- Lv.2 ----------------
  {
    title: "피보나치 수",
    level: 2,
    category: "DP",
    params: ["n"],
    description: `피보나치 수는 F(0) = 0, F(1) = 1일 때, 2 이상의 n에 대해 F(n) = F(n-1) + F(n-2)가 적용되는 수입니다.

2 이상의 \`n\`이 주어질 때, n번째 피보나치 수를 **1,234,567로 나눈 나머지**를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 2 ≤ \`n\` ≤ 100,000

### 입출력 예 설명
F(5) = F(4) + F(3) = 3 + 2 = 5`,
    exampleInputs: [[3], [5]],
    hiddenInputs: [[2], [10], [50], [1000], [100000]],
    reference: `function solution(n) {
  const MOD = 1234567;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) { const c = (a + b) % MOD; a = b; b = c; }
  return b;
}`,
  },
  {
    title: "올바른 괄호",
    level: 2,
    category: "스택/큐",
    params: ["s"],
    description: `괄호 문자 \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, \`]\`로만 이루어진 문자열 \`s\`가 주어집니다. 괄호가 **올바르게 짝지어져 있으면 true, 아니면 false**를 return 하는 \`solution\` 함수를 완성하세요.

올바른 괄호란, 모든 여는 괄호가 같은 종류의 닫는 괄호로 닫히고, 닫히는 순서도 맞는 것을 말합니다.

### 제한사항
- 1 ≤ \`s\`의 길이 ≤ 100,000

### 입출력 예 설명
"([)]"는 여는 순서와 닫는 순서가 어긋나 올바르지 않음`,
    exampleInputs: [["()[]{}"], ["([)]"]],
    hiddenInputs: [["("], [")("], ["{[()()]}"], ["((((((("], ["(".repeat(20000) + ")".repeat(20000)], ["(".repeat(20000) + ")".repeat(19999)]],
    reference: `function solution(s) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
    else if (stack.pop() !== pair[ch]) return false;
  }
  return stack.length === 0;
}`,
  },
  {
    title: "연속 부분 배열의 최대 합",
    level: 2,
    category: "DP",
    params: ["numbers"],
    description: `정수 배열 \`numbers\`가 주어집니다. **연속된 원소들로 이루어진 부분 배열** 중 합이 가장 큰 것의 합을 return 하는 \`solution\` 함수를 완성하세요. 부분 배열은 원소를 1개 이상 포함해야 합니다.

### 제한사항
- 1 ≤ \`numbers\`의 길이 ≤ 100,000
- -10,000 ≤ \`numbers\`의 원소 ≤ 10,000

### 입출력 예 설명
첫 번째 예: [4, -1, 2, 1]의 합 6이 최대

dp[i]를 "i번째 원소로 **끝나는** 부분 배열의 최대 합"으로 정의해 보세요.`,
    exampleInputs: [[[-2, 1, -3, 4, -1, 2, 1, -5, 4]], [[1, 2, 3]]],
    hiddenInputs: [[[-5]], [[-3, -1, -2]], [[5, -9, 6]], [ints(20000, -10000, 10000, 31)], [ints(20000, 1, 10, 32)]],
    reference: `function solution(numbers) {
  let best = numbers[0], cur = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    cur = Math.max(numbers[i], cur + numbers[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
  },
  {
    title: "출석하지 않은 학생",
    level: 2,
    category: "해시",
    params: ["students", "attended"],
    description: `학생 이름 배열 \`students\`와 출석한 학생 이름 배열 \`attended\`가 주어집니다. 출석하지 않은 학생은 **정확히 한 명**입니다. 그 학생의 이름을 return 하는 \`solution\` 함수를 완성하세요.

**동명이인이 있을 수 있습니다.** 같은 이름이 students에 두 번, attended에 한 번 있으면 그 이름이 답입니다.

### 제한사항
- 1 ≤ \`students\`의 길이 ≤ 100,000
- \`attended\`의 길이는 \`students\`의 길이보다 1 작습니다.
- 이름은 알파벳 소문자 1~20자입니다.

### 입출력 예 설명
두 번째 예: "kim"이 두 명인데 한 명만 출석`,
    exampleInputs: [
      [["lee", "kim", "park"], ["kim", "park"]],
      [["kim", "lee", "kim"], ["kim", "lee"]],
    ],
    hiddenInputs: [
      [["solo"], []],
      [["a", "a", "a"], ["a", "a"]],
      [
        [...Array.from({ length: 10000 }, (_, i) => word(5, i + 100)), "zzzzz"],
        Array.from({ length: 10000 }, (_, i) => word(5, i + 100)),
      ],
    ],
    reference: `function solution(students, attended) {
  const count = new Map();
  for (const name of attended) count.set(name, (count.get(name) ?? 0) + 1);
  for (const name of students) {
    const c = count.get(name) ?? 0;
    if (c === 0) return name;
    count.set(name, c - 1);
  }
  return "";
}`,
  },
  {
    title: "회의실 배정",
    level: 2,
    category: "그리디",
    params: ["meetings"],
    description: `회의실 하나를 여러 회의가 쓰려고 합니다. 각 회의는 \`[시작 시각, 끝 시각]\`으로 주어지고, 한 회의가 끝나는 시각에 다른 회의가 바로 시작할 수 있습니다 (끝 시각 = 시작 시각 허용).

겹치지 않게 진행할 수 있는 **회의의 최대 개수**를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`meetings\`의 길이 ≤ 100,000
- 0 ≤ 시작 시각 < 끝 시각 ≤ 1,000,000,000

### 입출력 예 설명
첫 번째 예: [1,3], [3,5], [6,8]을 고르면 3개

어떤 기준으로 정렬해서 고르면 항상 최선일지 생각해 보세요.`,
    exampleInputs: [
      [[[1, 4], [3, 5], [0, 6], [5, 7], [3, 8], [5, 9], [6, 10], [8, 11], [8, 12], [2, 13], [12, 14]]],
      [[[1, 3], [3, 5], [2, 6], [6, 8]]],
    ],
    hiddenInputs: [
      [[[0, 1]]],
      [[[0, 10], [1, 2], [2, 3], [3, 4]]],
      [[[5, 6], [5, 6], [5, 6]]],
      [
        (() => {
          const r = rng(41);
          return Array.from({ length: 15000 }, () => {
            const s = Math.floor(r() * 1000000000);
            return [s, s + 1 + Math.floor(r() * 1000)];
          });
        })(),
      ],
    ],
    reference: `function solution(meetings) {
  const sorted = [...meetings].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  let count = 0, end = -1;
  for (const [s, e] of sorted) {
    if (s >= end) { count++; end = e; }
  }
  return count;
}`,
  },
  {
    title: "거스름돈 최소 동전 개수",
    level: 2,
    category: "DP",
    params: ["coins", "amount"],
    description: `동전 종류 배열 \`coins\`와 거슬러 줄 금액 \`amount\`가 주어집니다. 각 동전은 **무한히** 쓸 수 있습니다. \`amount\`를 만드는 데 필요한 **최소 동전 개수**를 return 하는 \`solution\` 함수를 완성하세요. 만들 수 없으면 -1을 return 합니다.

### 제한사항
- 1 ≤ \`coins\`의 길이 ≤ 20, 1 ≤ 동전 값 ≤ 10,000
- 0 ≤ \`amount\` ≤ 100,000

### 입출력 예 설명
첫 번째 예: 11 = 5 + 5 + 1 → 3개

큰 동전부터 쓰는 방법은 항상 최선이 아닙니다 (두 번째 예를 확인해 보세요). dp[i]를 "금액 i를 만드는 최소 개수"로 정의해 보세요.`,
    exampleInputs: [[[1, 2, 5], 11], [[1, 3, 4], 6]],
    hiddenInputs: [[[2], 3], [[1], 0], [[7, 11], 100000], [[9, 6, 5, 1], 11], [[3, 7], 100000], [[2, 4], 100001]],
    reference: `function solution(coins, amount) {
  const INF = Infinity;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
  }
  return dp[amount] === INF ? -1 : dp[amount];
}`,
  },
  {
    title: "K번째로 작은 수",
    level: 2,
    category: "정렬",
    params: ["numbers", "queries"],
    description: `정수 배열 \`numbers\`와 질문 배열 \`queries\`가 주어집니다. 각 질문은 \`[i, j, k]\`이고, \`numbers\`의 i번째부터 j번째까지(0부터 시작, 양 끝 포함)를 잘라 정렬했을 때 **k번째(1부터 시작) 수**를 뜻합니다.

모든 질문의 답을 순서대로 담은 배열을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`numbers\`의 길이 ≤ 1,000
- 1 ≤ \`queries\`의 길이 ≤ 100
- 0 ≤ i ≤ j < \`numbers\`의 길이, 1 ≤ k ≤ j - i + 1

### 입출력 예 설명
[1, 5, 2, 6, 3, 7, 4]에서 [2, 5, 3]: 2~5번째는 [2, 6, 3, 7], 정렬하면 [2, 3, 6, 7], 3번째는 6`,
    exampleInputs: [[[1, 5, 2, 6, 3, 7, 4], [[2, 5, 3], [4, 4, 1], [1, 7, 3]]]],
    hiddenInputs: [
      [[9], [[0, 0, 1]]],
      [[3, 3, 3], [[0, 2, 2]]],
      [ints(1000, -1000, 1000, 51), Array.from({ length: 100 }, (_, i) => [i, 999 - i, i + 1])],
    ],
    reference: `function solution(numbers, queries) {
  return queries.map(([i, j, k]) => numbers.slice(i, j + 1).sort((a, b) => a - b)[k - 1]);
}`,
  },

  // ---------------- Lv.3 ----------------
  {
    title: "정수 삼각형",
    level: 3,
    category: "DP",
    params: ["triangle"],
    description: `위에서 아래로 내려가는 삼각형 모양의 숫자 배열 \`triangle\`이 주어집니다. 맨 위에서 시작해 한 칸씩 내려가며, 현재 칸에서 **바로 아래 왼쪽 또는 오른쪽 칸**으로만 이동할 수 있습니다.

맨 아래까지 내려갔을 때 거쳐 간 숫자의 **합이 가장 클 때의 값**을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ 삼각형의 높이 ≤ 500
- 0 ≤ 각 숫자 ≤ 9,999

### 입출력 예 설명
7 → 3 → 8 → 7 → 5 = 30`,
    exampleInputs: [[[[7], [3, 8], [8, 1, 0], [2, 7, 4, 4], [4, 5, 2, 6, 5]]]],
    hiddenInputs: [
      [[[5]]],
      [[[1], [2, 3]]],
      [[[0], [0, 0], [0, 0, 0]]],
      [
        (() => {
          const r = rng(61);
          return Array.from({ length: 200 }, (_, i) => Array.from({ length: i + 1 }, () => Math.floor(r() * 10000)));
        })(),
      ],
    ],
    reference: `function solution(triangle) {
  const dp = triangle.map((row) => row.slice());
  for (let i = 1; i < dp.length; i++) {
    for (let j = 0; j < dp[i].length; j++) {
      const left = j > 0 ? dp[i - 1][j - 1] : -Infinity;
      const right = j < dp[i - 1].length ? dp[i - 1][j] : -Infinity;
      dp[i][j] += Math.max(left, right);
    }
  }
  return Math.max(...dp[dp.length - 1]);
}`,
  },
  {
    title: "가장 긴 증가하는 부분 수열",
    level: 3,
    category: "DP",
    params: ["numbers"],
    description: `정수 배열 \`numbers\`가 주어집니다. 원소를 **순서는 유지한 채 일부만 골라** 만든 수열 중, 왼쪽에서 오른쪽으로 **항상 커지는(증가하는)** 가장 긴 수열의 길이를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`numbers\`의 길이 ≤ 1,000
- -1,000,000 ≤ \`numbers\`의 원소 ≤ 1,000,000

### 입출력 예 설명
[10, 20, 10, 30, 20, 50]에서 10 → 20 → 30 → 50, 길이 4

dp[i]를 "i번째 원소로 **끝나는** 증가 수열의 최대 길이"로 정의해 보세요.`,
    exampleInputs: [[[10, 20, 10, 30, 20, 50]], [[5, 4, 3, 2, 1]]],
    hiddenInputs: [[[7]], [[1, 1, 1, 1]], [[1, 2, 3, 4, 5]], [ints(1000, -1000000, 1000000, 71)], [ints(1000, 1, 50, 72)]],
    reference: `function solution(numbers) {
  const n = numbers.length;
  const dp = new Array(n).fill(1);
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (numbers[j] < numbers[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
  },
  {
    title: "섬의 개수",
    level: 3,
    category: "DFS/BFS",
    params: ["grid"],
    description: `0과 1로 이루어진 2차원 배열 \`grid\`가 주어집니다. 1은 땅, 0은 바다입니다. **상하좌우로 이어진 땅의 묶음**을 섬이라고 할 때, 섬의 개수를 return 하는 \`solution\` 함수를 완성하세요. 대각선은 이어진 것으로 보지 않습니다.

### 제한사항
- 1 ≤ 행, 열의 수 ≤ 300

### 입출력 예 설명
첫 번째 예: 왼쪽 위 묶음, 가운데 한 칸, 오른쪽 아래 묶음 → 3개

재귀로 깊게 파고들면 큰 입력에서 스택 오버플로가 날 수 있어요. 큐나 직접 만든 스택을 써 보세요.`,
    exampleInputs: [
      [
        [
          [1, 1, 0, 0, 0],
          [1, 1, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 1, 1],
        ],
      ],
      [[[0, 0], [0, 0]]],
    ],
    hiddenInputs: [
      [[[1]]],
      [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]],
      [Array.from({ length: 120 }, () => new Array(120).fill(1))],
      [Array.from({ length: 120 }, (_, i) => Array.from({ length: 120 }, (_, j) => ((i + j) % 2 === 0 ? 1 : 0)))],
      [
        (() => {
          const r = rng(81);
          return Array.from({ length: 150 }, () => Array.from({ length: 150 }, () => (r() < 0.6 ? 1 : 0)));
        })(),
      ],
    ],
    reference: `function solution(grid) {
  const h = grid.length, w = grid[0].length;
  const seen = grid.map((row) => row.map(() => false));
  let count = 0;
  for (let sy = 0; sy < h; sy++) for (let sx = 0; sx < w; sx++) {
    if (grid[sy][sx] !== 1 || seen[sy][sx]) continue;
    count++;
    const stack = [[sy, sx]];
    seen[sy][sx] = true;
    while (stack.length) {
      const [y, x] = stack.pop();
      for (const [dy, dx] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const ny = y + dy, nx = x + dx;
        if (ny < 0 || nx < 0 || ny >= h || nx >= w) continue;
        if (grid[ny][nx] !== 1 || seen[ny][nx]) continue;
        seen[ny][nx] = true;
        stack.push([ny, nx]);
      }
    }
  }
  return count;
}`,
  },
  {
    title: "나무 자르기",
    level: 3,
    category: "이분탐색",
    params: ["trees", "need"],
    description: `나무 높이 배열 \`trees\`와 필요한 나무 길이 \`need\`가 주어집니다. 절단기 높이 H를 정하면, H보다 높은 나무는 **H 위쪽 부분만** 잘려 나오고 H 이하인 나무는 잘리지 않습니다.

잘린 나무 길이의 합이 \`need\` 이상이 되게 하는 **H의 최댓값**을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`trees\`의 길이 ≤ 100,000
- 0 ≤ 나무 높이 ≤ 1,000,000,000
- 1 ≤ \`need\` ≤ 2,000,000,000 (항상 만들 수 있는 입력만 주어집니다)

### 입출력 예 설명
[20, 15, 10, 17], need 7: H = 15면 (20-15) + (17-15) = 7

H를 하나씩 올려보면 시간 초과가 납니다. "H로 잘랐을 때 7 이상인가?"는 H가 커질수록 거짓이 되므로 이분 탐색이 가능합니다.`,
    exampleInputs: [[[20, 15, 10, 17], 7], [[4, 42, 40, 26, 46], 20]],
    hiddenInputs: [[[5], 5], [[5], 1], [[1000000000, 1000000000], 2000000000], [ints(20000, 0, 1000000000, 91), 1000000000]],
    reference: `function solution(trees, need) {
  let lo = 0, hi = Math.max(...trees);
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    let got = 0;
    for (const t of trees) if (t > mid) got += t - mid;
    if (got >= need) lo = mid; else hi = mid - 1;
  }
  return lo;
}`,
  },
  {
    title: "배낭 채우기",
    level: 3,
    category: "DP",
    params: ["weights", "values", "capacity"],
    description: `물건의 무게 배열 \`weights\`, 가치 배열 \`values\`, 배낭이 버틸 수 있는 최대 무게 \`capacity\`가 주어집니다. 각 물건은 **한 번만** 넣을 수 있고, 쪼갤 수 없습니다.

무게 합이 \`capacity\`를 넘지 않게 담을 때 **가치 합의 최댓값**을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ 물건 수 ≤ 100
- 1 ≤ 무게 ≤ 1,000, 1 ≤ 가치 ≤ 10,000
- 1 ≤ \`capacity\` ≤ 10,000

### 입출력 예 설명
첫 번째 예: 무게 3, 4 물건을 담으면 가치 4 + 5 = 9

dp[w]를 "무게 w까지 쓸 때 가치 최댓값"으로 두고, 물건마다 w를 **큰 쪽에서 작은 쪽으로** 갱신하면 같은 물건을 두 번 넣는 걸 막을 수 있어요.`,
    exampleInputs: [[[1, 3, 4, 5], [1, 4, 5, 7], 7], [[10], [5], 5]],
    hiddenInputs: [
      [[1], [1], 1],
      [[2, 2, 2], [3, 3, 3], 3],
      [ints(100, 1, 1000, 101), ints(100, 1, 10000, 102), 10000],
      [ints(100, 500, 1000, 103), ints(100, 1, 10000, 104), 1000],
    ],
    reference: `function solution(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}`,
  },

  // ---------------- Lv.4 ----------------
  {
    title: "가장 긴 공통 부분 수열",
    level: 4,
    category: "DP",
    params: ["a", "b"],
    description: `알파벳 소문자로 이루어진 두 문자열 \`a\`, \`b\`가 주어집니다. 두 문자열에서 **순서를 유지한 채 글자를 골라** 만들 수 있는 공통 수열 중 가장 긴 것의 길이를 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 1 ≤ \`a\`, \`b\`의 길이 ≤ 1,000

### 입출력 예 설명
"acaykp"와 "capcak"의 공통 부분 수열 "acak", 길이 4

dp[i][j]를 "a의 앞 i글자와 b의 앞 j글자의 답"으로 정의하고, 마지막 글자가 같을 때와 다를 때를 나눠 생각해 보세요.`,
    exampleInputs: [["acaykp", "capcak"], ["abc", "def"]],
    hiddenInputs: [["a", "a"], ["abcde", "ace"], [word(1000, 111), word(1000, 112)], ["a".repeat(1000), "a".repeat(1000)]],
    reference: `function solution(a, b) {
  const n = a.length, m = b.length;
  let prev = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1).fill(0);
    for (let j = 1; j <= m; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[m];
}`,
  },
  {
    title: "편집 거리",
    level: 4,
    category: "DP",
    params: ["a", "b"],
    description: `알파벳 소문자로 이루어진 두 문자열 \`a\`, \`b\`가 주어집니다. \`a\`에 다음 연산을 반복해 \`b\`로 만들 때 **필요한 최소 연산 횟수**를 return 하는 \`solution\` 함수를 완성하세요.

- 글자 하나 삽입
- 글자 하나 삭제
- 글자 하나를 다른 글자로 교체

### 제한사항
- 0 ≤ \`a\`, \`b\`의 길이 ≤ 1,000

### 입출력 예 설명
"horse" → "ros": h를 r로 교체, r 삭제, e 삭제 → 3번`,
    exampleInputs: [["horse", "ros"], ["intention", "execution"]],
    hiddenInputs: [["", "abc"], ["abc", ""], ["same", "same"], [word(1000, 121), word(1000, 122)], ["a".repeat(1000), "b".repeat(1000)]],
    reference: `function solution(a, b) {
  const n = a.length, m = b.length;
  let prev = Array.from({ length: m + 1 }, (_, j) => j);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1);
    cur[0] = i;
    for (let j = 1; j <= m; j++) {
      cur[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[m];
}`,
  },
  {
    title: "최단 거리 구하기",
    level: 4,
    category: "그래프",
    params: ["n", "edges", "start"],
    description: `1번부터 \`n\`번까지의 노드와, 양방향 간선 배열 \`edges\`가 주어집니다. 각 간선은 \`[u, v, w]\`로, u와 v 사이를 비용 w로 오갈 수 있다는 뜻입니다.

\`start\` 노드에서 1번부터 n번까지 각 노드로 가는 **최단 비용**을 담은 길이 n의 배열을 return 하는 \`solution\` 함수를 완성하세요. 갈 수 없는 노드는 -1, 출발 노드 자신은 0입니다.

### 제한사항
- 1 ≤ \`n\` ≤ 20,000
- 0 ≤ \`edges\`의 길이 ≤ 100,000
- 1 ≤ w ≤ 1,000

### 입출력 예 설명
첫 번째 예: 1 → 2 (1), 1 → 2 → 3 (3), 4는 연결되지 않음

노드 수가 많아 모든 노드를 매번 훑으면 시간 초과가 납니다. 우선순위 큐(힙)를 직접 구현해 보세요.`,
    exampleInputs: [[4, [[1, 2, 1], [2, 3, 2], [1, 3, 5]], 1], [1, [], 1]],
    hiddenInputs: [
      [3, [[1, 2, 5], [1, 2, 1]], 2],
      [5, [[1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [1, 5, 10]], 1],
      [
        3000,
        (() => {
          const r = rng(131);
          const edges = [];
          for (let i = 2; i <= 3000; i++) edges.push([i, 1 + Math.floor(r() * (i - 1)), 1 + Math.floor(r() * 1000)]);
          for (let k = 0; k < 9000; k++) {
            edges.push([1 + Math.floor(r() * 3000), 1 + Math.floor(r() * 3000), 1 + Math.floor(r() * 1000)]);
          }
          return edges;
        })(),
        1,
      ],
    ],
    reference: `function solution(n, edges, start) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const dist = new Array(n + 1).fill(Infinity);
  dist[start] = 0;
  // 이진 힙
  const heap = [[0, start]];
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]]; i = p;
    }
  };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [d, u] = pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; push([dist[v], v]); }
    }
  }
  return dist.slice(1).map((d) => (d === Infinity ? -1 : d));
}`,
  },

  // ---------------- Lv.5 ----------------
  {
    title: "모든 도시 방문 최소 비용",
    level: 5,
    category: "DP",
    params: ["cost"],
    description: `도시 \`n\`개가 있고, \`cost[i][j]\`는 도시 i에서 j로 가는 비용입니다 (0부터 시작, 비용은 방향에 따라 다를 수 있음). 0번 도시에서 출발해 **모든 도시를 정확히 한 번씩 방문하고 다시 0번으로 돌아오는** 경로의 최소 비용을 return 하는 \`solution\` 함수를 완성하세요.

### 제한사항
- 2 ≤ \`n\` ≤ 13
- 1 ≤ \`cost[i][j]\` ≤ 1,000 (i ≠ j), \`cost[i][i]\` = 0

### 입출력 예 설명
첫 번째 예: 0 → 1 → 3 → 2 → 0 = 10 + 25 + 30 + 15 = 80

모든 순서를 다 세면 12! ≈ 4억 가지라 시간 초과입니다. "지금까지 방문한 도시 집합"을 비트마스크로 표현해 dp[집합][현재 도시]를 채워 보세요.`,
    exampleInputs: [
      [
        [
          [0, 10, 15, 20],
          [10, 0, 35, 25],
          [15, 35, 0, 30],
          [20, 25, 30, 0],
        ],
      ],
      [[[0, 5], [7, 0]]],
    ],
    hiddenInputs: [
      [[[0, 1, 1], [1, 0, 1], [1, 1, 0]]],
      [
        (() => {
          const r = rng(141);
          const n = 13;
          return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : 1 + Math.floor(r() * 1000))));
        })(),
      ],
      [
        (() => {
          const r = rng(142);
          const n = 12;
          return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : 1 + Math.floor(r() * 1000))));
        })(),
      ],
    ],
    reference: `function solution(cost) {
  const n = cost.length, FULL = (1 << n) - 1, INF = Infinity;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(INF));
  dp[1][0] = 0;
  for (let mask = 1; mask <= FULL; mask++) {
    if (!(mask & 1)) continue;
    for (let u = 0; u < n; u++) {
      if (dp[mask][u] === INF || !(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const nm = mask | (1 << v);
        const c = dp[mask][u] + cost[u][v];
        if (c < dp[nm][v]) dp[nm][v] = c;
      }
    }
  }
  let best = INF;
  for (let u = 1; u < n; u++) best = Math.min(best, dp[FULL][u] + cost[u][0]);
  return best;
}`,
  },
];
