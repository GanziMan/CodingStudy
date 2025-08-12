function solution(m, v) {
  let left = 0;
  let left2 = 0;
  let result = 0;

  while (left < m.length && left2 < v.length) {
    if (m[left] <= v[left2]) {
      left2++;
      left++;
      result++;
    } else {
      left2++;
    }
  }

  return result;
}

console.log(solution([2, 4, 6, 8, 10], [1, 3, 5, 7, 9, 11]));
console.log(solution([5, 10, 15], [5, 5]));
console.log(solution([2, 4], [1, 2, 3]));
