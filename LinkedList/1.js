class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    this.head = {
      value: value,
      next: null,
    };
    this.tail = this.head;
    this.length = 1;
  }

  append(value) {
    const newNode = new Node(value);
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
  }

  reverse() {
    if (this.head.next === null) return this.head;
  }
}

function solution(arr) {
  return;
}

console.log(solution([1, 2, 3, 4, 5]));
console.log(solution([3, 2, 1]));
