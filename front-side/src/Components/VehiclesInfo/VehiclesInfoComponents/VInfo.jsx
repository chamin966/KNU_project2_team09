import { invisibleCarIcon, visibleCarIcon } from 'Slices/CarIconsSlice';
import { addCar, removeCar } from 'Slices/ChooseCarObjSlice';
import {
  invisiblePath,
  updatePaths,
  visiblePath,
} from 'Slices/PathsDataObjSlice';
import { connect } from 'react-redux';
import styled from 'styled-components';

const VInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding-bottom: 4px;
`;

const VInfoBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 80px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  background-color: ${(props) => {
    if (props.isActivate === true) return `${props.backgroundColor}`;
    return ``;
  }};
  color: ${(props) => {
    if (props.isActivate === true) return `${props.color}`;
    return `${props.backgroundColor}`;
  }};

  &:hover {
    cursor: pointer;
  }

  transition: all linear 0.3s;
`;

function VInfo({
  id,
  vehicleName,
  carColor,
  chooseCarObj,
  addCarAtVinfo,
  removeCarAtVinfo,
  invisibleCarIconAtVinfo,
  visibleCarIconAtVinfo,
  invisiblePathAtVinfo,
  visiblePathAtVinfo,
}) {
  const getTextColorByBackgroundColor = (hexColor) => {
    const c = hexColor.substring(1); // 색상 앞의 # 제거
    const rgb = parseInt(c, 16); // rrggbb를 10진수로 변환
    const r = (rgb >> 16) & 0xff; // red 추출
    const g = (rgb >> 8) & 0xff; // green 추출
    const b = (rgb >> 0) & 0xff; // blue 추출
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    // 글자 색상 선택
    return luma < 127.5 ? 'white' : 'black';
  };

  const onClickVInfoBox = () => {
    if (chooseCarObj[id]) {
      removeCarAtVinfo(id);
      invisibleCarIconAtVinfo(id);
      invisiblePathAtVinfo(id);
    } else {
      addCarAtVinfo({ id: id, carName: vehicleName });
      visibleCarIconAtVinfo(id);
      visiblePathAtVinfo(id);
    }
  };

  return (
    <VInfoContainer>
      <div>
        <VInfoBtn
          backgroundColor={carColor}
          color={getTextColorByBackgroundColor(carColor)}
          onClick={onClickVInfoBox}
          isActivate={chooseCarObj[id] === undefined ? false : true}
        >
          {vehicleName}
        </VInfoBtn>
      </div>
    </VInfoContainer>
  );
}

function mapStateToProps(state) {
  return {
    chooseCarObj: state.chooseCarObj,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addCarAtVinfo: (carIdAndName) => dispatch(addCar(carIdAndName)),
    removeCarAtVinfo: (carId) => dispatch(removeCar(carId)),
    updatePathsAtVinfo: (props) => dispatch(updatePaths(props)),
    invisibleCarIconAtVinfo: (props) => dispatch(invisibleCarIcon(props)),
    visibleCarIconAtVinfo: (props) => dispatch(visibleCarIcon(props)),
    invisiblePathAtVinfo: (props) => dispatch(invisiblePath(props)),
    visiblePathAtVinfo: (props) => dispatch(visiblePath(props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VInfo);
