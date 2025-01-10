function solution(n, k, cmd) {
  let answer = "";

  let stack = [];
  let trash = [];
  let selectedRow = k;

  for (let i = 0; i < n; i++) {
    stack.push(i);
  }

  for (let i = 0; i < cmd.length; i++) {
    if (cmd[i].slice(0, 1) === "D") {
      selectedRow += Number(cmd[i].slice(2, 3));
    } else if (cmd[i].slice(0, 1) === "U") {
      selectedRow -= Number(cmd[i].slice(2, 3));
    } else if (cmd[i].slice(0, 1) === "Z") {
      const recentPop = trash.pop();
      stack.push(recentPop);
    } else {
      stack = stack.filter((item) => item !== selectedRow);
      trash.push(selectedRow);
    }
  }

  stack.sort((a, b) => a - b);
  trash.sort((a, b) => b - a);

  for (let i = 0; i < n; i++) {
    if (trash[trash.length - 1] === i) {
      answer += "X";
      trash.pop();
    } else {
      answer += "O";
    }
  }

  return answer;
}

solution(8, 2, ["D 2", "C", "U 3", "C", "D 4", "C", "U 2", "Z", "Z"]);
// solution(8, 2, [
//   "D 2",
//   "C",
//   "U 3",
//   "C",
//   "D 4",
//   "C",
//   "U 2",
//   "Z",
//   "Z",
//   "U 1",
//   "C",
// ]);
