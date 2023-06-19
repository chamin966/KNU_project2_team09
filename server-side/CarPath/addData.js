import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const turf = require('@turf/turf');

import { colorMarkerDark, colorMarkerLight } from '../markerColor.js';
import { getCarAngle } from '../getCarAngle.js';

const addData = (
  idInfo,
  timeAndPosInfo,
  coordInfo,
  steps,
  timeData,
  startKey,
  gap
) => {
  // 위경도 추출을 위한 coords, 차량 식별을 위한 id를 인자로 받음
  // 경로를 지도에 표시하기 위해 turf.js 라이브러리를 사용

  const route = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordInfo,
          angles: [],
        },
      },
    ],
  };

  // for문 두 점 받아옴, 두 점 사이 스탭스로 나눔(carPath에서 설정)
  const way = [];
  let count = 0; //steps가 몇번째 interval을 가리키는지 알기 위한 변수
  for (let i = 0; i < coordInfo.length - 1; i++) {
    const [prevLong, prevLat] = coordInfo[i];
    const [nextLong, nextLat] = coordInfo[i + 1];
    if (i == 0) {
      //젤 처음에는 젤 앞부분도 push해야함
      way.push([prevLong, prevLat]);
    }

    let line = turf.lineString([
      [prevLong, prevLat],
      [nextLong, nextLat],
    ]);

    let lineDistance = turf.length(line);
    let num = 0;
    //if분기를 줘서 steps가 일정 이상이면 중간에 껏다 다시온거이므로 해당 steps만큼 보간해주는 것이 아니라 싹다 널값으로 넣어줌
    //1배속 기준 gap은 main의 interval*60, steps가 1분 이상 즉 60이상일 경우 중간이 비었다고 판단
    if (steps[count] < 60) {
      //같은 좌표일 경우 움직임이 없으므로 그 좌표 그대로 넣어줌
      if (lineDistance === 0) {
        for (let i = 0; i < steps[count] - 1; i++) {
          way.push([prevLong, prevLat]);
          num++;
        }
      }
      //다른 좌표일 경우 두 점 사이의 거리 lineDistance 사이를 해당 steps-1 만큼 점을 추가해줌
      else {
        for (
          let i = 0;
          i < lineDistance;
          i += lineDistance / (steps[count] - 1)
        ) {
          if (num === steps[count] - 1) break;
          const segment = turf.along(line, i);
          const segCoord = segment.geometry.coordinates;
          way.push(segCoord);
          num++;
        }
      }
    }
    //중간에 비는 경우
    else {
      for (let i = 0; i < steps[count] - 1; i++) {
        way.push([null, null]);
        num++;
      }
    }

    count++;
    way.push([nextLong, nextLat]);
  }

  // 이후 아이콘 표시에 사용하기 위해 way 배열을 route 내부 객체에 할당
  route.features[0].geometry.coordinates = way;

  const angles = getCarAngle(way);

  //경로 표시를 위해 시간순으로 쌓여있는 좌표를 역순으로 뒤집어줌
  way.reverse();

  let temp;
  for (let i = 0; i < angles.length; i++) {
    //시작시간보다 시간key가 크면 데이터 넣기
    temp = way.pop();
    if (i < gap) {
      if (i > timeAndPosInfo[0].time - startKey) {
        timeData[i].push({
          category: 'car',
          id: `c${idInfo}`,
          position: temp,
          angle: angles[i],
          color: [colorMarkerDark[idInfo], colorMarkerLight[idInfo]],
          paths: [...way],
        });
      }
      //시작시간보다 시간key가 작아서 아직 출발안한 경우
      else {
        timeData[i].push({
          category: 'car',
          id: `c${idInfo}`,
          position: [null, null],
          angle: [0, 0],
          color: [colorMarkerDark[idInfo], colorMarkerLight[idInfo]],
          paths: [],
        });
      }
    }
  }
};

export { addData };
