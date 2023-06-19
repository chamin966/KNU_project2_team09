const carPath = (carData, speed, time_pathArr, pathArr, steps) => {
  let share;
  let remain = 0;
  //time_pathArr에다가 DB에 있는 데이터를 시간, 위도,경도 담아주기
  for (let j = 0; j < carData.length; j++) {
    if (carData != null) {
      let nowKey = Number(
        String(carData[j].time.getTime()).split('').slice(3, 10).join('')
      );
      time_pathArr.push({
        time: nowKey,
        position: [carData[j].longtitude, carData[j].latitude],
      });
      //첫번째를 제외하고 배속에 따라 구간조정이 깔끔하게 되기 위해 나머지 이용
      if (j > 0) {
        share = parseInt(
          speed * (time_pathArr[j].time - time_pathArr[j - 1].time)
        );
        remain +=
          (speed * (time_pathArr[j].time - time_pathArr[j - 1].time)) % 1;
        if (remain > 1) {
          share = share + 1;
          remain = remain - 1;
        }
        steps.push(share);
      }
      pathArr.push([carData[j].longtitude, carData[j].latitude]);
    }
  }
};

export { carPath };
