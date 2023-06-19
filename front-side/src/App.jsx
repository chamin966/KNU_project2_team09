import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl';
import { IconLayer, PathLayer, TextLayer } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GlobalStyles from 'style/globalStyle';
import { connect } from 'react-redux';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const CAR_ICON_MAPPING = {
  marker: {
    x: 0,
    y: 0,
    width: 512,
    height: 512,
    anchorY: 258,
    mask: true, //색상을 넣을 수 있게 할 것인가?
  },
};

const PASSENGER_ICON_MAPPING = {
  marker: {
    x: 0,
    y: 0,
    width: 512,
    height: 512,
    anchorY: 512,
  },
};

const INITIAL_VEIW_STATE = {
  latitude: 37.47933360604123, //위도
  longitude: 126.48087128779333, //경도
  zoom: 11.7, //확대
  pitch: 0, //기울기
  bearing: 0, // 화면 회전
  height: '100%',
  width: '100%',
};

function App({ pathsDataObj, carIconsObj, passengerIconArr, isDarkValue }) {
  const [pathsData, setPathsData] = useState(pathsDataObj);
  const [icons, setIcons] = useState(carIconsObj);
  const [passengerIcons, setPassengerIcons] = useState(passengerIconArr);
  const [isDark, setIsDark] = useState(isDarkValue);

  const layer = [
    new PathLayer({
      id: 'path-layer',
      data: pathsData.paths,
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: (d) => d.path,
      getColor: (d) => (isDarkValue ? d.color[0] : d.color[1]),
      getWidth: (d) => 0.3,
    }),
    new IconLayer({
      id: 'car-icon-layer',
      pickable: true,
      data: icons,
      iconAtlas: '/Images/samples/vehicle_icon.jpg',
      iconMapping: CAR_ICON_MAPPING,
      getIcon: () => 'marker',
      getPosition: (d) => d.position,
      getSize: () => 1,
      getColor: (d) => (isDarkValue ? d.color[0] : d.color[1]),
      getAngle: (d) => d.angle,
      billboard: false,
      sizeUnits: 'meters',
      sizeScale: 15,
      sizeMinPixels: 35,
      sizeMaxPixels: 60,
    }),
    new IconLayer({
      id: 'passenger-drop-off-icon-layer',
      pickable: true,
      data: passengerIcons.filter((icon) => icon.id.at(-1) === 'D'),
      iconAtlas: '/Images/samples/drop-off_icon.png', //파란색 깃발
      iconMapping: PASSENGER_ICON_MAPPING,
      getIcon: () => 'marker',
      getPosition: (d) => d.position,
      getSize: () => 1,
      getAngle: (d) => d.angle,
      billboard: true,
      sizeUnits: 'meters',
      sizeMinPixels: 50,
      sizeMaxPixels: 50,
    }),
    new IconLayer({
      id: 'passenger-pick-up-icon-layer',
      pickable: true,
      data: passengerIcons.filter((icon) => icon.id.at(-1) === 'P'),
      iconAtlas: '/Images/samples/pick-up_icon.png', //빨간색 깃발
      iconMapping: PASSENGER_ICON_MAPPING,
      getIcon: () => 'marker',
      getPosition: (d) => d.position,
      getSize: () => 1,
      getAngle: (d) => d.angle,
      billboard: true,
      sizeUnits: 'meters',
      sizeMinPixels: 50,
      sizeMaxPixels: 50,
    }),
    new TextLayer({
      id: 'text-layer',
      data: passengerIcons,
      pickable: true,
      getPosition: (d) => d.position,
      getText: (d) => d.name,
      getColor: (d) => (d.id.at(-1) === 'P' ? [0, 0, 0] : [255, 255, 255]),
      getSize: 1,
      getAngle: 0,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      billboard: true,
      lineHeight: 7.3,
      fontWeight: '900',
      sizeScale: 10,
    }),
  ];

  // 우클릭 방지
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    setPathsData(pathsDataObj);
  }, [pathsDataObj]);

  useEffect(() => {
    setIcons(carIconsObj);
  }, [carIconsObj]);

  useEffect(() => {
    setPassengerIcons(passengerIconArr);
  }, [passengerIconArr]);

  useEffect(() => {
    setIsDark(isDarkValue);
  }, [isDarkValue]);

  return (
    /*
    DeckGL XML 속성
    initialViewState: 초기 맵 뷰 설정
    controller: 화면 확대, 축소, 기울이기 등 조정 가능
    layers: 시각화시킬 것들 레이어에 전부 넣고 Map에 덮어 씌우는 것
    Map XML 속성
    mapboxAccessToken: 액세스 토큰
    mapStyle: 맵 테마
    */

    <div>
      <GlobalStyles />
      <DeckGL
        initialViewState={INITIAL_VEIW_STATE}
        controller={true}
        layers={[layer]}
        getTooltip={({ object }) => {
          if (object && object.id) {
            if (object.name) {
              return `요청 id: ${object.id}\nname: ${object.name}`;
            } else {
              const carName = object.id.slice(1);
              return `차량: 영종 ${carName}호`;
            }
          }
          return null;
        }}
      >
        {isDark ? (
          <Map
            mapboxAccessToken={ACCESS_TOKEN}
            mapStyle='mapbox://styles/mapbox/dark-v11'
          />
        ) : (
          <Map
            mapboxAccessToken={ACCESS_TOKEN}
            mapStyle='mapbox://styles/mapbox/light-v11'
          />
        )}
      </DeckGL>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    pathsDataObj: state.pathsDataObj,
    carIconsObj: state.carIconsObj,
    passengerIconArr: state.passengerIconsArr,
    isDarkValue: state.isDarkValue,
  };
}

export default connect(mapStateToProps)(App);
