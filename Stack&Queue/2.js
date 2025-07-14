function solution(gates) {
  const stack = [];
  for (const gate of gates) {
    if (stack[stack.length - 1] === "<" && gate === ">") {
      stack.pop();
    } else {
      stack.push(gate);
    }
  }
  console.log(stack);
  return stack.length === 0 ? true : false;
}

console.log(solution("<<>>"));
// console.log(solution("<><>"));
// console.log(solution(">><<"));
// console.log(solution("<<<>"));
