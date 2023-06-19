import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Client = require('pg');
const turf = require('@turf/turf');
const url = require('url');
const express = require('express');
const cors = require('cors');
const app = express();

import { addData } from './CarPath/addData.js';
import { carPath } from './CarPath/carPath.js';

app.use(cors());
app.set('port', 3001);

//DB에 있는 차량 영종차량 ID들
let carTable = [2, 5, 9, 11, 15, 17, 20, 21];

//local DB host와 password 맞추기
const pg = new Client.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

//시각 맞추기함수
function leftPad(value) {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}

//timeData?time=xxxx-xx-xx yy:yy:yy&speed=(0.5 / 1.0 / 1.5 / 2.0)&interval=n&schedule=0or1
app.get('/timeData', async (req, response) => {
  let client = await pg.connect();
  let queryData = url.parse(req.url, true).query;
  let startTime = queryData.time; //시작시간 문자열(쿼리용)
  let nowTime = new Date(queryData.time); //현재 시간
  let newTime = new Date(queryData.time);
  let interval = Number(queryData.interval);
  newTime.setMinutes(newTime.getMinutes() + interval); //15분 뒤의 시간
  let endTime =
    newTime.getFullYear() +
    '-' +
    leftPad(newTime.getMonth() + 1) +
    '-' +
    leftPad(newTime.getDate()) +
    ' ' +
    leftPad(newTime.getHours()) +
    ':' +
    leftPad(newTime.getMinutes()) +
    ':' +
    leftPad(newTime.getSeconds());
  //한시간 뒤의 끝시간 문자열(쿼리용)
  let now_transTime = nowTime.getTime();
  let new_transTime = newTime.getTime(); //현재시간과 한시간 뒤의 시간을 변환해서 저장

  let timeData = new Object(); //return value
  let startKey = Number(String(now_transTime).split('').slice(3, 10).join(''));
  let endKey = Number(String(new_transTime).split('').slice(3, 10).join('')); //1초가 1씩 증가하도록 잘라줌
  let gap = endKey - startKey;

  let speed;
  switch (queryData.speed) {
    case '0.5':
      speed = 2;
      break;
    case '1.0':
      speed = 1;
      break;
    case '1.5':
      speed = 2 / 3;
      break;
    case '2.0':
      speed = 0.5;
      break;
    default:
      speed = 1;
      break;
  }

  gap = gap * speed;

  //각 timestamp마다 초기화 및 xxxx-xx-xx yy:yy:yy형식으로 주기
  for (let i = 0; i < gap; i++) {
    let temp = new Date(queryData.time);
    temp.setSeconds(newTime.getSeconds() + i * queryData.speed);
    let timestamp =
      temp.getFullYear() +
      '-' +
      leftPad(temp.getMonth() + 1) +
      '-' +
      leftPad(temp.getDate()) +
      ' ' +
      leftPad(temp.getHours()) +
      ':' +
      leftPad(temp.getMinutes()) +
      ':' +
      leftPad(temp.getSeconds());
    timeData[i] = new Array();
    timeData[i].push({ category: 'realtime', date: timestamp });
  }

  //이전 시간의 배차요청에서 남아있는 마커들의 정보를 담을 배열
  let remains = new Array();

  let carQuery = `select distinct ac.time as time, ac.car as car_id, ac.x as longtitude, ac.y as latitude, ac.direction_degree as angle from local_trace_log.all_cars as ac inner join local_request_log.yeongjong as y on ac.car = y.car where ac.time BETWEEN \'${startTime}\' and \'${endTime}\' and y.request_time BETWEEN \'${startTime}\' and \'${endTime}\'  and not ac.x is null order by ac.time;`;
  let requestQuery = ``;
  try {
    let res = await pg.query(carQuery);

    let resultArr = new Array();

    //각 차량별로 쿼리 결과를 담을 obj 초기화 및 쿼리 결과 분류
    for (let i = 0; i < 1; i++) {
      let resultObj = new Object();
      for (let i = 0; i < carTable.length; i++) {
        resultObj[carTable[i]] = [];
      }

      for (let j = 0; j < res['rows'].length; j++) {
        resultObj[res['rows'][j]['car_id']].push(res['rows'][j]);
      }
      resultArr.push(resultObj);
    }

    for (let i = 0; i < carTable.length; i++) {
      //for 구문 돌면서 각각의 차량id마다 addData함수 사용해서 보간값 추가 후 삽입
      let carId = carTable[i];
      //category car 안에 paths 배열 하나 만들어서 시간키값으로 쭉 steps로 분간했을때 자기 좌표 포함해서 자기차량의 뒤쪽 10개까지 배열에 넣어서 하나 더 주기
      let carData = resultArr[0][carId];
      let time_pathArr = new Array();
      let pathArr = new Array();
      let steps = new Array();

      //DB의 데이터와 배속을 가지고 사이값을 넣어주기 위해 좌표배열과 사이값계산함수
      carPath(carData, speed, time_pathArr, pathArr, steps);

      if (carData.length > 0) {
        //사이값을 보정해준 후 리턴할 구조체에 담아주는 함수
        addData(carId, time_pathArr, pathArr, steps, timeData, startKey, gap);
      }
    }
  } catch (err) {
    console.log(err);
    response.send(err.message);
  }

  response.json(timeData);

  client.release();
});

app.listen(3001, () => {
  console.log('Connect Success');
  console.log('Port number : ' + 3001);
});
