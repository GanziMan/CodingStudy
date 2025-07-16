class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor(value) {
    this.head = {
      value: value,
      next: null,
      prev: null,
    };
    this.tail = this.head;
    this.length = 1;
  }

  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
    this.length++;
  }

  append(value) {
    const newNode = new Node(value);
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  findNode(index) {
    let count = 0;
    let currentNode = this.head;

    while (count !== index) {
      currentNode = currentNode.next;
      count++;
    }

    return currentNode;
  }
  insert(index, value) {
    if (index === 0) {
      this.prepend(value);
      return;
    }

    if (index >= this.length) {
      this.append(value);
      return;
    }

    const newNode = new Node(value);
    const prevNode = this.findNode(index - 1);
    const nextNode = prevNode.next;
    newNode.next = nextNode;
    newNode.prev = prevNode;
    prevNode.next = newNode;
    nextNode.prev = newNode;
    this.length++;
  }

  remove(index) {
    // 맨 앞을 삭제할 때
    if (index === 0) {
      // 길이가 1이라면
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        this.head.prev = null;
      }
      this.length--;
      return;
    }

    if (index >= this.length) return;

    // index - 1 하는 이유
    const prevNode = this.findNode(index - 1);
    const nextNode = prevNode.next;
    prevNode.next = nextNode;
    if (nextNode) {
      nextNode.prev = prevNode;
    } else {
      this.tail = prevNode; // 만약 삭제하는 노드가 tail이라면 tail을 prevNode로 변경
    }
    this.length--;
  }
}
