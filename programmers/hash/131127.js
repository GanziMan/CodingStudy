function sortCount(want, number) {
  const hashTable = {};
  for (let i = 0; i < want.length; i++) {
    hashTable[want[i]] = number[i];
  }
  return hashTable;
}

function solution(want, number, discount) {
  let hashTable = sortCount(want, number);

  let cnt = 0;
  for (let i = 0; i < discount.length; i++) {
    for (let j = i; j < 10 + i; j++) {
      if (hashTable[discount[j]]) hashTable[discount[j]]--;
    }
    if (Object.values(hashTable).every((value) => value === 0)) {
      cnt++;
    }
    hashTable = sortCount(want, number);
  }

  return cnt;
}
