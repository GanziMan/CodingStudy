// Queue
function solution(commands) {
  const queue = [];
  const result = [];

  for (const command of commands) {
    if (command.split(" ")[0] === "ENQUEUE") {
      queue.push(Number(command.split(" ")[1]));
    } else {
      result.push(queue.length ? queue.shift() : "EMPTY");
    }
  }

  return result;
}
console.log(
  solution(["ENQUEUE 3", "ENQUEUE 5", "DEQUEUE", "DEQUEUE", "DEQUEUE"])
);
