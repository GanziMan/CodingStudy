function countSort(records) {
  const hashTable = {};
  for (const record of records) {
    const command = record.split(" ")[0];
    const uid = record.split(" ")[1];
    const name = record.split(" ")[2];
    if (command === "Enter" && uid) {
      hashTable[uid] = name;
    } else if (command === "Change") {
      hashTable[uid] = name;
    }
  }
  return hashTable;
}

function solution(records) {
  const hashTable = countSort(records);
  const answer = [];
  for (const record of records) {
    const command = record.split(" ")[0];
    const uid = record.split(" ")[1];
    if (command === "Enter") {
      answer.push(hashTable[uid] + "님이 들어왔습니다.");
    } else if (command === "Leave") {
      answer.push(hashTable[uid] + "님이 나갔습니다.");
    }
  }
  return answer;
}
