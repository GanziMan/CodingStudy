function solution(boxes) {
  let stack = [];
  for (let i = 0; i < boxes.length; i++) {
    if (stack.length === 0 || stack[stack.length - 1] !== boxes[i]) {
      stack.push(boxes[i]);
    }
  }
  return stack;
}

console.log(solution([2, 2, 5, 5, 5, 1, 1]));
console.log(solution([7, 7, 8, 8, 0, 0, 0]));
