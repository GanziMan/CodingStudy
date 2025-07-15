function solution(queue1, queue2, k) {
  const queue = [...queue1, queue2];
  const result = [];

  while (result.length < k && queue.length > 0) {
    if (queue.shift % 2 === 0) {
      result.push(queue.shift());
    } else {
      queue.push(queue.shift());
    }
  }
}
console.log(solution([1, 3, 4, 6, 5, 8, 3]));
