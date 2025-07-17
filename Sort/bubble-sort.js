function bubbleSort(array) {
  const n = array.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (array[j] > array[j + 1]) {
        // 방법 1
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        // 방법 2
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }

  return array;
}
