function sortCount(want, number) {
  const hashTable = {};
  for (let i = 0; i < want.length; i++) {
    hashTable[want[i]] = number[i];
  }

  return hashTable;
}

function solution(want, number, discount) {
  const hashTable = sortCount(want, number);

  for (const purch of discount) {
    if (hashTable[purch]) hashTable[purch]--;
  }
  var answer = 0;

  return answer;
}

solution(
  ["banana", "apple", "rice", "pork", "pot"],
  [3, 2, 2, 2, 1],
  [
    "chicken",
    "apple",
    "apple",
    "banana",
    "rice",
    "apple",
    "pork",
    "banana",
    "pork",
    "rice",
    "pot",
    "banana",
    "apple",
    "banana",
  ]
); // 3
