function problem_76502() {
  let count = 0;
  let str = "[]{}()";
  for (let i = 0; i < str.length; i++) {
    let stack = [];
    let strArray = str.slice();
    for (let j = 0; j < strArray.length; j++) {
      if (strArray[j] === "[" || strArray[j] === "{" || strArray[j] === "(")
        stack.push(strArray[j]);
      else if (
        (strArray[j] === ")" && stack[stack.length - 1] === "(") ||
        (strArray[j] === "}" && stack[stack.length - 1] === "{") ||
        (strArray[j] === "]" && stack[stack.length - 1] === "[")
      ) {
        stack.pop();
      }
    }

    if (stack.length === 0) {
      count += 1;
    }
    str = str.slice(1) + str.slice(0, 1);
    stack = [];
  }
}
