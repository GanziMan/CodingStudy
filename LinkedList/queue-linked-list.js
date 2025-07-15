class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  enqueue(value) {
    const newNode = new Node(value);
    if (this.length === 0) {
      this.first = newNode;
      this.last = newNode;
    } else {
      const oldLast = this.last;
      oldLast.next = newNode;
      this.last = newNode;
    }
    this.length++;
  }
  dequeue() {
    if (!this.first) return null;

    const removedNode = this.first;

    if (this.first === this.last) {
      this.first = null;
      this.last = null;
    } else {
      this.first = this.first.next;
    }
    this.length--;
    return removedNode;
  }
  peek() {
    return this.first;
  }
}

const queue = new Queue();
queue.enqueue("A");
queue.enqueue("B");
console.log(queue);
