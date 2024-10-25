function solution(input) {
  const keyPad = {
    1: [".", "Q", "Z"],
    2: ["A", "B", "C"],
    3: ["D", "E", "F"],
    4: ["G", "H", "I"],
    5: ["J", "K", "L"],
    6: ["M", "N", "O"],
    7: ["P", "R", "S"],
    8: ["T", "V", "U"],
    9: ["W", "X", "Y"],
  };
  let count = 0;
  let result = "";
  for (let i = 0; i < input.length; i++) {
    if (input[i] == input[i + 1]) {
      count += 1;
    } else {
      if (input[i] == "0") {
        count = 0;
      } else {
        result += keyPad[input[i]][count];
        count = 0;
      }
    }
  }
  console.log(result);
  return "";
}

console.log(solution("44335550555666"));
console.log(solution("9666775553"));
console.log(solution("2220281"));
