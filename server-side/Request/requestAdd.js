import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Heap } = require('heap-js');

const requestAdd = (
  timeData,
  requestData,
  carId,
  speed,
  startKey,
  remains,
  request_heap
) => {
  for (let j = 0; j < requestData.length; j++) {
    //requestData에서 각 시간들을 변형
    let requestTime = Number(
      String(new Date(requestData[j]['request_time']).getTime())
        .split('')
        .slice(3, 10)
        .join('')
    );
    let pickupTime = Number(
      String(new Date(requestData[j]['pickup_time']).getTime())
        .split('')
        .slice(3, 10)
        .join('')
    );
    let dropoffTime = Number(
      String(new Date(requestData[j]['dropoff_time']).getTime())
        .split('')
        .slice(3, 10)
        .join('')
    );
    let pickup_position = requestData[j]['pickup_station']
      .slice(6, requestData[j]['pickup_station'].length - 1)
      .split(' ')
      .map(Number);
    let dropoff_position = requestData[j]['dropoff_station']
      .slice(6, requestData[j]['dropoff_station'].length - 1)
      .split(' ')
      .map(Number);

    let pickupId = `r${carId}${pickupTime}P`;
    let dropoffId = `r${carId}${dropoffTime}D`;
    let index = parseInt(speed * (requestTime - startKey));
    let markerName = carId + (requestTime % 65536).toString(16);
    //배차요청 중 픽업 마커용
    //index가 양수면 시작시간 이후의 새로 들어온 배차요청들
    if (index > 0) {
      timeData[index].push({
        category: 'request',
        id: pickupId,
        position: pickup_position,
        name: markerName,
      });
      //배차요청 중 드롭오프 마커용
      timeData[index].push({
        category: 'request',
        id: dropoffId,
        position: dropoff_position,
        name: markerName,
      });
    }
    //index가 음수이면 지금시간보다 이전에 배차요청이 있었지만 마커가 남아있어야하는 remains
    //remains 배열에다가 이 데이터들을 싹 넣어놓은 다음
    else {
      let remains_data = new Object();
      remains_data.id = dropoffId;
      remains_data.position = dropoff_position;
      remains_data.name = markerName;

      remains.push(remains_data);

      //남아있는 데이터 중에 하차데이터는 쿼리문에 의해 무조건 남아있는 데이터지만 탑승데이터는 if구문으로 체크해서 삽입
      if (pickupTime >= startKey) {
        let remains_data = new Object();
        remains_data.id = pickupId;
        remains_data.position = pickup_position;
        remains_data.name = markerName;

        remains.push(remains_data);
      }
    }
    //각각의 minHeap에다가 데이터 넣기
    //pickup같은 경우 마커가 남아 있는 경우에만
    if (pickupTime >= startKey) {
      request_heap.push({ time: pickupTime, id: pickupId });
    }

    request_heap.push({ time: dropoffTime, id: dropoffId });
  }
};

export { requestAdd };
