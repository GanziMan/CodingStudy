class Queue {
  constructor() {
    this.array = [];
  }
  enqueue(value) {
    this.array.push(value);
  }
  dequeue() {
    return this.array.shift();
  }
}

const queue = new Queue();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
queue.enqueue("D");
console.log(queue);
queue.dequeue();
console.log(queue);
