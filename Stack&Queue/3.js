function solution(s) {
  let result = [];
  for (const char of s) {
    if (
      result.length > 0 &&
      char.toLowerCase() === result[result.length - 1].toLowerCase() &&
      result[result.length - 1] !== char
    ) {
      result.pop();
    } else {
      result.push(char);
    }
  }
  return result.toString().replaceAll(",", "");
}

// 다른 조건
// result.length > 0 이면서 Math.abs(char.charCodeAt() - result[result.length-1].charCodeAt()) === 32

console.log(solution("infFflearn"));
console.log(solution("aAbBcC"));
console.log(solution("xYyX"));
console.log(solution("a"));
console.log(solution("Code"));
