function solution(cards1, cards2, goal) {
  let count = 0;
  for (let i = 0; i < goal.length; i++) {
    if (cards1[0] === goal[i]) {
      cards1.shift();
      count++;
    } else if (cards2[0] === goal[i]) {
      cards2.shift();
      count++;
    }
  }

  return goal.length === count ? "Yes" : "No";
}
