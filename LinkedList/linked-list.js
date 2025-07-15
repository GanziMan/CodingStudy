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
  //   맨 앞 추가
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
  }
  //   맨 뒤 추가
  append(value) {
    const newNode = new Node(value);
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
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
    // 1. 이전 노드를 먼저 찾기
    // 왜 index - 1이냐? 현재 들어갈 index에 뒤이기 때문이다.
    const prevNode = this.findNode(index - 1);
    const nextNode = prevNode.next;
    newNode.next = nextNode;
    prevNode.next = newNode;
    this.length++;
  }

  remove(index) {
    // 이전 노드를 다음 노드로 연결 시켜주기만 하면 됩니다.
    const prevNode = this.findNode(index - 1);
    const removeNode = prevNode.next;
    prevNode.next = removeNode.next;
    this.length--;
  }

  printList() {
    const array = [];
    // 헤드부터 노드 시작
    let currentNode = this.head;
    while (currentNode !== null) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    console.log(array);
  }
}

const linkedList = new LinkedList("Dora");

linkedList.append("Sindy");
linkedList.append("Bumsu");
linkedList.remove(1);
linkedList.printList();
