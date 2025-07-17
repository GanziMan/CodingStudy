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
      prev: null,
      next: null,
    };
    this.tail = this.head;
    this.selected = null;
    this.stack = [];
  }

  append(value, cursor) {
    const newNode = new Node(value);
    newNode.prev = this.tail;

    // 이전 노드와 새 노드를 연결해주는 역할
    this.tail.next = newNode;
    // 새 tail에 노드 추가
    this.tail = newNode;

    if (cursor === value) {
      this.selected = newNode;
    }
  }

  move(direction, count) {
    let currentNode = this.selected;
    for (let i = 0; i < count; i++) {
      currentNode = currentNode[direction];
    }
    // 최종적인 selected된 노드
    this.selected = currentNode;
  }

  remove() {
    this.stack.push(this.selected);
    const prevNode = this.selected.prev;
    const nextNode = this.selected.next;

    if (prevNode) {
      prevNode.next = nextNode;
    }
    if (nextNode) {
      nextNode.prev = prevNode;
      this.selected = nextNode;
    } else {
      this.selected = prevNode;
    }
  }

  recover() {
    const recoverNode = this.stack.pop();
    const prevNode = recoverNode.prev;
    const nextNode = recoverNode.next;

    if (prevNode) {
      prevNode.next = recoverNode;
    }
    if (nextNode) {
      nextNode.prev = recoverNode;
    }
  }
}

function solution(n, k, cmd) {
  const result = Array.from({ length: n }, () => "O");

  const linkedList = new DoublyLinkedList(0);
  for (let i = 1; i < n; i++) {
    // value와 선택된 위치 k
    linkedList.append(i, k);
  }

  for (const command of cmd) {
    const [action, count] = command.split(" ");

    if (action === "R") {
      linkedList.move("next", count);
    }
    if (action === "L") {
      linkedList.move("prev", count);
    }
    if (action === "D") {
      linkedList.remove();
    }
    if (action === "U") {
      linkedList.recover();
    }
  }

  linkedList.stack.forEach((node) => (result[node.value] = "X"));

  return result.join("");
}

console.log(solution(5, 2, ["D", "D", "D"]));
console.log(solution(6, 2, ["D", "R 2", "D", "U"]));
console.log(solution(8, 3, ["D", "D", "L 2", "D", "U"]));
