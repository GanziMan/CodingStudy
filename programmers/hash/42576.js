function countSort(completion) {
  const hashTable = {};
  for (const data of completion) {
    if (hashTable[data]) {
      hashTable[data]++;
    } else {
      hashTable[data] = 1;
    }
  }
  return hashTable;
}

function solution(participant, completion) {
  const hashTable = countSort(completion);
  let answer = "";
  for (const data of participant) {
    if (hashTable[data]) {
      hashTable[data]--;
    } else {
      answer = data;
    }
  }
  return answer;
}
solution(["mislav", "stanko", "mislav", "ana"], ["stanko", "ana", "mislav"]);
