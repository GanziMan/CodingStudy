function solution(board, moves) {
  let data = board;
  let stack = [];
  let bombCount = 0;
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (data[j][moves[i] - 1] !== 0) {
        stack.push(data[j][moves[i] - 1]);
        data[j][moves[i] - 1] = 0;
        break;
      }
    }
    if (stack.length > 1) {
      if (stack[stack.length - 1] === stack[stack.length - 2]) {
        stack.pop();
        stack.pop();
        bombCount += 2;
      }
    }
  }
  return bombCount;
}
