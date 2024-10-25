function solution(input) {
  let dupNotArray = [];

  for (let i = 0; i < input.length; i++) {
    if (!dupNotArray.includes(input[i])) {
      dupNotArray.push(input[i]);
    }
  }

  return dupNotArray
}

solution([1, 5, 8, 2, 10, 5, 4, 6, 4, 8]); // [1, 5, 8, 2, 10, 4, 6]
solution([5, 4, 4, 3, 5]); // [5, 4, 3]
