class Stack {
  constructor() {
    this.array = [];
  }
  push(value) {
    this.array.push(value);
  }
  pop() {
    this.array.pop();
  }
  //
  peek() {
    return this.array[this.array.length - 1];
  }
}

const stack = new Stack();
stack.push("A");
stack.push("B");
stack.push("C");
stack.push("D");
console.log(stack);
console.log(stack.peek());
stack.pop();
console.log(stack.peek());
console.log(stack);
