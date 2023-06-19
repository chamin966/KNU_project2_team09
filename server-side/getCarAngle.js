import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const turf = require('@turf/turf');

// 차량 방향 표시를 위해서 data 배열을 순환하면서
// 현재 위치와 다음 위치 사이에서 차량이 가질 각도를
// turf.bearing 함수를 이용하여 router 객체 내부 angle 배열에 차례로 저장
function getCarAngle(data) {
  let angle = [0];
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i][0] != null && data[i + 1][0]) {
      let point1 = turf.point([data[i][0], data[i][1]]);
      let point2 = turf.point([data[i + 1][0], data[i + 1][1]]);
      let bearing = turf.bearing(point1, point2);
      if (bearing === 0) angle.push(angle.at(-1));
      else angle.push(-bearing);
    } else {
      angle.push(0);
    }
  }
  return angle;
}
export { getCarAngle };
