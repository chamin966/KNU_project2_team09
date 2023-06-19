import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updatePaths } from 'Slices/PathsDataObjSlice';
import { updateCarIcons } from 'Slices/CarIconsSlice';
import {
  addPassengerIcon,
  deletePassengerIcon,
  remainPassengerIcon,
} from 'Slices/PassengerIconSlice';

const PlayContollerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin: 0px 25px 30px 25px;
  border-radius: 8px;
`;

const PlayContollerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 0px 10px 10px 5px;
  button,
  select,
  input {
    border: none;
  }

  button {
    background-color: white;
  }

  input {
    width: 200px;
  }
`;

const InputTimeBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  overflow: hidden;

  span {
    display: inline-block;
    text-align: center;
    margin-right: 10px;
    width: 30px;
    font-weight: 600;
  }

  input {
    border: none;
  }

  visibility: ${(props) => {
    if (props.isOpen) return 'visible';
    return 'hidden';
  }};
  height: ${(props) => {
    if (props.isOpen) return '40px';
    return '0px';
  }};
  padding: ${(props) => {
    if (props.isOpen) return '15px 0px 5px 0px';
    return '0px';
  }};

  transition: all ease-out 0.4s;
`;

const Loading = styled.button`
  animation: rotate-center 1s linear infinite;
  border: none;
  background-color: white;
  @keyframes rotate-center {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

const OpenTimeIcon = styled.div`
  text-align: center;
  cursor: pointer;
`;

const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
const INTERVAL = 15;

const INITIAL_START_TIME = '2022-09-01 10:00:00';
const INITIAL_END_TIME = '2022-09-01 22:00:00';

function PlayController({
  chooseCarObj,
  updateCarIconsAtPlayController,
  updatePathsAtPlayController,
  remainPassengerIconAtPlayController,
  addPassengerIconAtPlayController,
  deletePassengerIconAtPlayController,
  isDarkValue,
}) {
  const [isPause, setIsPause] = useState(false); // 일시 정지 버튼이 눌렸는지 알기 위한 isPause 변수
  const [animationId, setAnimationId] = useState({}); // 애니메이션 컨트롤을 위해 id를 저장하는 animationId 객체
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(0);
  const [isOpenTimeInput, setIsOpenTimeInput] = useState(true);
  const [endTime, setEndTime] = useState(INITIAL_END_TIME);

  const tempEndTimeRef = useRef('');
  const presentTimeRef = useRef(INITIAL_START_TIME);
  const newStartTimeRef = useRef(INITIAL_START_TIME);
  const speedRef = useRef('2.0');
  const pauseCountRef = useRef(0); // 재개를 위해 일시 정지된 지점을 저장하기 위한 pauseTime 변수
  const dataObjRef = useRef({});
  const totalCountRef = useRef(0);
  const prevDataObjRef = useRef({});
  const prevTotalCountRef = useRef(0);
  const changedChooseCarObjRef = useRef(chooseCarObj);
  const playingDataLengthRef = useRef(0);

  const play = (now, endCount, data) => {
    if (pauseCountRef.current === 0) newRequestData();
    if (now < pauseCountRef.current) now = pauseCountRef.current;

    const move = () => {
      if (data[String(now)] === undefined || data[String(now)] === null) return;
      if (Date.parse(presentTimeRef.current) > Date.parse(endTime))
        return console.log('종료 시간을 넘었으므로 애니메이션 종료');

      data[String(now)].forEach((info) => {
        const targetId = info.id;
        const chooseCarIdsArr = Object.keys(changedChooseCarObjRef.current);
        // eslint-disable-next-line default-case
        switch (info.category) {
          case 'realtime': {
            presentTimeRef.current = info.date;
            break;
          }
          case 'remains': {
            remainPassengerIconAtPlayController(info.data);
            break;
          }
          case 'request': {
            addPassengerIconAtPlayController({
              id: info.id,
              position: info.position,
              color: info.color,
              name: info.name,
            });
            break;
          }
          case 'car': {
            if (chooseCarIdsArr.includes(targetId)) {
              updateCarIconsAtPlayController({
                id: targetId,
                position: info.position,
                angle: info.angle,
                color: info.color,
              });
              updatePathsAtPlayController({
                id: targetId,
                paths: [...info.paths],
                color: info.color,
              });
            }
            break;
          }
          case 'delete': {
            deletePassengerIconAtPlayController(targetId);
            break;
          }
          case 'schedule': {
            if (chooseCarIdsArr.includes(targetId)) {
              updateCarIconsAtPlayController({
                id: targetId,
                position: info.position,
                angle: info.angle,
                color: info.color,
              });
              updatePathsAtPlayController({
                id: targetId,
                paths: [...info.paths],
                color: info.color,
              });
            }
          }
        }
      });

      now += 1;

      if (now > endCount) {
        pauseCountRef.current = 0;
        if (Date.parse(newStartTimeRef.current) < Date.parse(endTime)) {
          return play(0, totalCountRef.current, dataObjRef.current);
        }
      } else {
        pauseCountRef.current = now;
        setLoad(now);
        animationId[String(now)] = requestAnimationFrame(move);
      }
    };

    move();
  };

  const quitAnimation = () => {
    Object.values(animationId).forEach((v) => cancelAnimationFrame(v));
    setAnimationId({}); // 모든 애니메이션을 종료하였으므로 animationId 객체 초기화
  };

  const PlayAndPause = async () => {
    // 일시정지 버튼이 눌리면 id 객체에 담아놓은 값들을
    // cancelAnimationFrame 함수로 현재 진행 중인 모든 애니메이션을 종료하고
    // isPause 변수의 boolean 값을 뒤집는다.
    setIsPause(!isPause);
    if (isPause === true) quitAnimation();
    else {
      if (pauseCountRef.current === 0) {
        playingDataLengthRef.current = totalCountRef.current;
        play(0, totalCountRef.current, dataObjRef.current);
      } else {
        playingDataLengthRef.current = prevTotalCountRef.current;
        play(0, prevTotalCountRef.current, prevDataObjRef.current);
      }
    }
  };

  const getCarsPosInfo = async (requstTime) => {
    console.log('데이터 요청');
    try {
      const response = await axios.get(
        `http://localhost:3001/timeData?time=${requstTime}&speed=${speedRef.current}&interval=${INTERVAL}`
      );
      console.log(`${requstTime} 이후의 데이터 받아옴`);
      return response;
    } catch (e) {
      console.log('something went wrong!', e);
      throw e;
    }
  };

  const newRequestData = () => {
    Object.assign(prevDataObjRef.current, dataObjRef.current);
    prevTotalCountRef.current = totalCountRef.current;

    const calcTime = new Date(newStartTimeRef.current);
    calcTime.setMinutes(calcTime.getMinutes() + INTERVAL); // 다음 시간으로 요청
    newStartTimeRef.current = new Date(calcTime.getTime() + TIME_ZONE)
      .toISOString()
      .replace('T', ' ')
      .slice(0, -5);

    getCarsPosInfo(newStartTimeRef.current).then((res) => {
      dataObjRef.current = res.data;
      totalCountRef.current = Object.keys(res.data).length - 1;
    });
  };

  const pauseToTimeAndSpeedChange = (type) => {
    setIsLoading(true);
    // eslint-disable-next-line default-case
    switch (type) {
      case 'T': {
        getCarsPosInfo(presentTimeRef.current).then((res) => {
          dataObjRef.current = res.data;
          totalCountRef.current = Object.keys(res.data).length - 1;
          setIsLoading(false);
          setIsPause(false);
        });
        break;
      }
      case 'S': {
        const calcTime = new Date(newStartTimeRef.current);
        calcTime.setMinutes(calcTime.getMinutes() - INTERVAL); // 이전 시간에서 다시 받아오기
        newStartTimeRef.current = new Date(calcTime.getTime() + TIME_ZONE)
          .toISOString()
          .replace('T', ' ')
          .slice(0, -5);

        getCarsPosInfo(newStartTimeRef.current).then((res) => {
          const percent = (
            pauseCountRef.current / prevTotalCountRef.current
          ).toFixed(7);
          prevDataObjRef.current = res.data;
          prevTotalCountRef.current = Object.keys(res.data).length - 1;
          pauseCountRef.current = parseInt(prevTotalCountRef.current * percent);
          setIsLoading(false);
          setIsPause(false);
        });
        newRequestData();
        break;
      }
    }
  };

  const onChangePresentTime = (e) => {
    quitAnimation();
    setAnimationId({});
    const inputTime = e.target.value.split('T').join(' ');
    presentTimeRef.current = inputTime;
    newStartTimeRef.current = inputTime;
  };

  const onBlurPresentTime = () => {
    quitAnimation(); // 달력에서 조작 잘못하면 날짜가 선택되지 않기 때문에 미리 애니메이션 종료
    pauseCountRef.current = 0;
    pauseToTimeAndSpeedChange('T');
  };

  const onChangeEndTime = (e) => {
    quitAnimation();
    const inputTime = e.target.value.split('T').join(' ');
    tempEndTimeRef.current = inputTime;
  };

  const onBlurEndTime = () => {
    quitAnimation();
    setEndTime(tempEndTimeRef.current);
  };

  const onChangeSpeed = async (e) => {
    quitAnimation();
    speedRef.current = e.target.value;
    pauseToTimeAndSpeedChange('S');
  };

  const onChangeProgressBar = (e) => {
    e.preventDefault();
    // setLoad(e.target.value);
  };

  const onClickOpenTimeBtn = () => {
    setIsOpenTimeInput((prev) => !prev);
  };

  useEffect(() => {
    setIsLoading(true);
    getCarsPosInfo(newStartTimeRef.current).then((res) => {
      dataObjRef.current = res.data;
      totalCountRef.current = Object.keys(res.data).length - 1;
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    changedChooseCarObjRef.current = chooseCarObj;
  }, [chooseCarObj]);

  return (
    <PlayContollerContainer>
      <InputTimeBox isOpen={isOpenTimeInput}>
        <div>
          <span>현재</span>
          <input
            type='datetime-local'
            step='1'
            value={presentTimeRef.current}
            onChange={onChangePresentTime}
            onBlur={onBlurPresentTime}
            disabled={isLoading}
          />
        </div>
        <div>
          <span>종료</span>
          <input
            type='datetime-local'
            step='1'
            value={endTime}
            onChange={onChangeEndTime}
            onBlur={onBlurEndTime}
            disabled={isLoading}
          />
        </div>
      </InputTimeBox>
      {isOpenTimeInput ? (
        <OpenTimeIcon
          className='material-symbols-rounded'
          onClick={onClickOpenTimeBtn}
        >
          arrow_drop_down
        </OpenTimeIcon>
      ) : (
        <OpenTimeIcon
          className='material-symbols-rounded'
          onClick={onClickOpenTimeBtn}
        >
          arrow_drop_up
        </OpenTimeIcon>
      )}
      <PlayContollerBox>
        {isLoading === true ? (
          <Loading>
            <span className='material-symbols-rounded'>rotate_left</span>
          </Loading>
        ) : (
          <button onClick={PlayAndPause}>
            {isPause ? (
              <span className='material-symbols-rounded'>pause</span>
            ) : (
              <span className='material-symbols-rounded'>play_arrow</span>
            )}
          </button>
        )}
        <input
          type='range'
          value={load}
          max={playingDataLengthRef.current}
          min={0}
          onChange={onChangeProgressBar}
        />
        <select
          onChange={onChangeSpeed}
          defaultValue={'2.0'}
          disabled={isLoading}
        >
          <option value={'2.0'}>2.0x</option>
          <option value={'1.5'}>1.5x</option>
          <option value={'1.0'}>1.0x</option>
          <option value={'0.5'}>0.5x</option>
        </select>
      </PlayContollerBox>
    </PlayContollerContainer>
  );
}
function mapStateToProps(state) {
  return { chooseCarObj: state.chooseCarObj, isDarkValue: state.isDarkValue };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePathsAtPlayController: (props) => dispatch(updatePaths(props)),
    updateCarIconsAtPlayController: (props) => dispatch(updateCarIcons(props)),
    remainPassengerIconAtPlayController: (props) =>
      dispatch(remainPassengerIcon(props)),
    addPassengerIconAtPlayController: (props) =>
      dispatch(addPassengerIcon(props)),
    deletePassengerIconAtPlayController: (props) =>
      dispatch(deletePassengerIcon(props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayController);
