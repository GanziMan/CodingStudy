// 계수정렬
// 계수 정렬은 입력 배열을 순회하면서 각 원소의 등장 횟수를 세는 알고리즘.
function countingSort(arr, k) {
  const hashTable = new Array(k + 1).fill(0);

  for (const num of arr) {
    if (num <= k) {
      hashTable[num] = 1;
    }
  }

  return hashTable;
}

function solution(arr, target) {
  const hashTable = countingSort(arr, target);

  for (const num of arr) {
    const remainValue = target - num;

    if (
      hashTable[remainValue] === 1 &&
      remainValue >= 0 &&
      remainValue <= target
    ) {
      return true;
    }
  }
  return false;
}

solution([1, 2, 3, 4, 8], 6);
// solution([2, 3, 5, 9], 10);
