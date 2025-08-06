function solution(tickets) {
  if (!tickets.length) return 0;

  tickets.sort((a, b) => a[1] - b[1]);

  console.log(tickets);
  //   단속 초기화
  let inspections = 1;

  //   첫번째 승객의 하차시간 단속 시간
  let inspectionTime = tickets[0][1]; //5

  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i][0] > inspectionTime) {
      inspections++;
      inspectionTime = tickets[i][1];
    }
  }

  return inspections;
}
