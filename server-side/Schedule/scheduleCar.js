import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { getCarAngle } from '../getCarAngle.js';
import scheduleJson from './schedule.json' assert { type: 'json' };

const scheduleCar = (timeData, startKey, endKey, speed) => {
  //schedule.json에 있는 첫번째 경로 데이터에 시간 정보를 키 값 비교를 위해 변환
  let scheduleTime = new Date(
    scheduleJson.features[0].properties.startTime
  ).getTime();
  let scheduleKey = Number(
    String(scheduleTime).split('').slice(3, 10).join('')
  );
  //startKey, endKey, schedule 값을 비교해 start, pathStart, end, pathEnd 변수 값 할당
  if (
    startKey - scheduleJson.features[0].geometry.coordinates.length <
      scheduleKey &&
    endKey > scheduleKey
  ) {
    let start, pathStart;
    let end, pathEnd;
    if (
      startKey <= scheduleKey &&
      scheduleKey <=
        endKey - scheduleJson.features[0].geometry.coordinates.length
    ) {
      start = scheduleKey - startKey;
      end =
        scheduleKey -
        startKey +
        scheduleJson.features[0].geometry.coordinates.length;
      pathStart = 0;
      pathEnd = scheduleJson.features[0].geometry.coordinates.length;
    } else if (scheduleKey < startKey) {
      start = 0;
      end =
        scheduleJson.features[0].geometry.coordinates.length -
        (startKey - scheduleKey);
      pathStart = startKey - scheduleKey;
      pathEnd = scheduleJson.features[0].geometry.coordinates.length;
    } else if (
      scheduleKey >
      endKey - scheduleJson.features[0].geometry.coordinates.length
    ) {
      start = scheduleKey - startKey;
      end = endKey - startKey;
      pathStart = 0;
      pathEnd = endKey - scheduleKey;
    }
    let angle = getCarAngle(scheduleJson.features[0].geometry.coordinates);
    let count = pathStart;
    //timeData에 데이터 양식에 맞춰 대입
    for (let i = start * speed; i < end * speed; i++) {
      console.log(Math.trunc(i));
      timeData[Math.trunc(i)].push({
        category: 'schedule',
        id: 'sch1',
        position:
          scheduleJson.features[0].geometry.coordinates[Math.trunc(count)],
        angle: angle[Math.trunc(count)],
        color: [
          [0, 255, 102],
          [204, 0, 102],
        ],
        paths: scheduleJson.features[0].geometry.coordinates.slice(
          Math.trunc(pathStart),
          pathEnd
        ),
      });
      count = count + 1 * (1 / speed);
      pathStart = pathStart + 1 * (1 / speed);
    }
  }
  //schedule.json에 있는 두번째 경로 데이터에 시간 정보를 키 값 비교를 위해 변환
  scheduleTime = new Date(
    scheduleJson.features[1].properties.startTime
  ).getTime();
  scheduleKey = Number(String(scheduleTime).split('').slice(3, 10).join(''));
  //startKey, endKey, schedule 값을 비교해 start, pathStart, end, pathEnd 변수 값 할당
  if (
    startKey - scheduleJson.features[1].geometry.coordinates.length <
      scheduleKey &&
    endKey > scheduleKey
  ) {
    let start, pathStart;
    let end, pathEnd;
    if (
      startKey <= scheduleKey &&
      scheduleKey <=
        endKey - scheduleJson.features[1].geometry.coordinates.length
    ) {
      start = scheduleKey - startKey;
      end =
        scheduleKey -
        startKey +
        scheduleJson.features[1].geometry.coordinates.length;
      pathStart = 0;
      pathEnd = scheduleJson.features[1].geometry.coordinates.length;
    } else if (scheduleKey < startKey) {
      start = 0;
      end =
        scheduleJson.features[1].geometry.coordinates.length -
        (startKey - scheduleKey);
      pathStart = startKey - scheduleKey;
      pathEnd = scheduleJson.features[1].geometry.coordinates.length;
    } else if (
      scheduleKey >
      endKey - scheduleJson.features[1].geometry.coordinates.length
    ) {
      start = scheduleKey - startKey;
      end = endKey - startKey;
      pathStart = 0;
      pathEnd = endKey - scheduleKey;
    }
    let angle = getCarAngle(scheduleJson.features[1].geometry.coordinates);
    let count = pathStart;
    //timeData에 데이터 양식에 맞춰 대입
    for (let i = start * speed; i < end * speed; i++) {
      console.log(Math.trunc(i));
      timeData[Math.trunc(i)].push({
        category: 'schedule',
        id: 'sch2',
        position:
          scheduleJson.features[1].geometry.coordinates[Math.trunc(count)],
        angle: angle[Math.trunc(count)],
        color: [
          [0, 102, 51],
          [204, 0, 255],
        ],
        paths: scheduleJson.features[1].geometry.coordinates.slice(
          Math.trunc(pathStart),
          pathEnd
        ),
      });
      count = count + 1 * (1 / speed);
      pathStart = pathStart + 1 * (1 / speed);
    }
  }
};

export { scheduleCar };

