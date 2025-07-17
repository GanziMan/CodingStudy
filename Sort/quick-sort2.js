function quickSort(array, left = 0, right = array.length - 1) {
  // 재귀 탈출 조건
  if (left < right) {
    const partitionIndex = partition(array, left, right);

    quickSort(array, left, partitionIndex - 1);
    quickSort(array, partitionIndex, right);
  }

  return array;
}
