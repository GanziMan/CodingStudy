function mergeSort(array) {
  if (array.length === 1) {
    return array;
  }
  const length = array.length;
  const middle = Math.floor(length / 2);

  const left = array.slice(0, middle);
  const right = array.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  // 답을 담을 배열
  const result = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  //   console.log(leftIndex);
  //   return result;
}

console.log(mergeSort([2, 3, 6, 8, 4, 5, 7]));
