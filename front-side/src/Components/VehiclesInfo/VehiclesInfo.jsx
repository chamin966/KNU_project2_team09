import { connect } from 'react-redux';
import VInfo from './VehiclesInfoComponents/VInfo';
import styled from 'styled-components';
import { chooseAllCar, removeAllCar } from 'Slices/ChooseCarObjSlice';
import { useState } from 'react';
import {
  AllInvisiblePath,
  AllVisiblePath,
  updatePaths,
} from 'Slices/PathsDataObjSlice';
import {
  AllInvisibleCarIcon,
  AllVisibleCarIcon,
  updateCarIcons,
} from 'Slices/CarIconsSlice';

const VehicleInfoContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 1;
  margin-top: 15px;
  margin-left: 15px;
  border-radius: 12px;
  padding: 10px;
`;

const ChooseAllCarBtn = styled.button`
  font-weight: 600;
  font-size: 0.95rem;
  margin: 5px 0px 15px 0px;
  padding-bottom: 3px;
  border: none;
  border-bottom: 1px solid white;
  background-color: white;
  cursor: pointer;
  color: black;

  &:hover {
    border-bottom: 1px solid #5c5c5c;
  }

  transition: all ease-out 0.4s;
`;

const DropIcon = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const CarBtnBox = styled.div`
  height: ${(props) => {
    if (props.isDrop) return '580px';
    return '0px';
  }};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all ease-out 0.3s;
`;

const RemoveAllCarBtn = styled(ChooseAllCarBtn)``;

function VehicleInfo({
  chooseCarObj,
  isDarkValue,
  chooseAllCarAtVehicleInfo,
  removeAllCarAtVehicleInfo,
  AllInvisibleCarIconAtVehicleInfo,
  AllVisibleCarIconAtVehicleInfo,
  AllInvisiblePathAtVehicleInfo,
  AllVisiblePathAtVehicleInfo,
}) {
  const [isDrop, setIsDrop] = useState(true);
  const vehicleInfoArr = [
    {
      vehicleName: '영종 02호',
      id: 'c2',
      color: isDarkValue ? '#89DDFF' : '#13A4D0',
    },
    {
      vehicleName: '영종 05호',
      id: 'c5',
      color: isDarkValue ? '#FFCB6B' : '#F9AF1C',
    },
    {
      vehicleName: '영종 09호',
      id: 'c9',
      color: isDarkValue ? '#FF5370' : '#D06357',
    },
    {
      vehicleName: '영종 11호',
      id: 'c11',
      color: isDarkValue ? '#48A446' : '#426E3B',
    },
    {
      vehicleName: '영종 15호',
      id: 'c15',
      color: isDarkValue ? '#A73ED6' : '#785692',
    },
    {
      vehicleName: '영종 17호',
      id: 'c17',
      color: isDarkValue ? '#BFDCFB' : '#8994BD',
    },
    {
      vehicleName: '영종 20호',
      id: 'c20',
      color: isDarkValue ? '#1584A4' : '#3B8989',
    },
    {
      vehicleName: '영종 21호',
      id: 'c21',
      color: isDarkValue ? '#F4BCB9' : '#BF4D87',
    },
    {
      vehicleName: '예상 01호',
      id: 'sch1',
      color: isDarkValue ? '#00ff66' : '#cc0066',
    },
    {
      vehicleName: '예상 02호',
      id: 'sch2',
      color: isDarkValue ? '#006633' : '#cc00ff',
    },
  ];

  const onClickRemoveAllCarBtn = () => {
    removeAllCarAtVehicleInfo();
    AllInvisibleCarIconAtVehicleInfo();
    AllInvisiblePathAtVehicleInfo();
  };

  const onClickChooseAllCarBtn = () => {
    chooseAllCarAtVehicleInfo();
    AllVisibleCarIconAtVehicleInfo();
    AllVisiblePathAtVehicleInfo();
  };

  const onClickDropBtn = () => {
    setIsDrop((prev) => !prev);
  };

  return (
    <VehicleInfoContainer>
      {isDrop ? (
        <DropIcon className='material-symbols-rounded' onClick={onClickDropBtn}>
          arrow_drop_up
        </DropIcon>
      ) : (
        <DropIcon className='material-symbols-rounded' onClick={onClickDropBtn}>
          arrow_drop_down
        </DropIcon>
      )}

      <CarBtnBox isDrop={isDrop}>
        {Object.keys(chooseCarObj).length > 0 ? (
          <RemoveAllCarBtn onClick={onClickRemoveAllCarBtn}>
            전체 삭제
          </RemoveAllCarBtn>
        ) : (
          <ChooseAllCarBtn onClick={onClickChooseAllCarBtn}>
            전체 선택
          </ChooseAllCarBtn>
        )}
        {vehicleInfoArr.map((v, i) => (
          <VInfo
            key={i}
            id={v.id}
            vehicleName={v.vehicleName}
            carColor={v.color}
          />
        ))}
      </CarBtnBox>
    </VehicleInfoContainer>
  );
}

function mapStateToProps(state) {
  return {
    chooseCarObj: state.chooseCarObj,
    isDarkValue: state.isDarkValue,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    chooseAllCarAtVehicleInfo: () => dispatch(chooseAllCar()),
    removeAllCarAtVehicleInfo: () => dispatch(removeAllCar()),
    updatePathsAtVehicleInfo: (props) => dispatch(updatePaths(props)),
    updateCarIconsAtVehicleInfo: (props) => dispatch(updateCarIcons(props)),
    AllInvisibleCarIconAtVehicleInfo: (props) =>
      dispatch(AllInvisibleCarIcon(props)),
    AllVisibleCarIconAtVehicleInfo: (props) =>
      dispatch(AllVisibleCarIcon(props)),
    AllInvisiblePathAtVehicleInfo: (props) => dispatch(AllInvisiblePath(props)),
    AllVisiblePathAtVehicleInfo: (props) => dispatch(AllVisiblePath(props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicleInfo);
