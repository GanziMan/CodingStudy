class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
    this.bottom = null;
    this.length = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (this.length === 0) {
      this.top = newNode;
      this.bottom = newNode;
    } else {
      const oldTop = this.top;
      this.top = newNode;
      this.top.next = oldTop;
    }
    this.length++;
  }

  pop() {
    if (!this.top) return null;
    const removedNode = this.top;
    if (this.top === this.bottom) {
      this.top = null;
      this.bottom = null;
    } else {
      this.top = this.top.next;
    }

    this.length--;
    return removedNode;
  }

  peek() {
    return this.top;
  }
}

const stack = new Stack();
stack.push("A");
stack.push("B");
stack.push("C");
stack.push("D");
console.log("stack", stack);

stack.pop();
stack.pop();

console.log("stack", stack.peek());
