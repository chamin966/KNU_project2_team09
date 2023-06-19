import PlayController from './ContollersComponents/PlayController/PlayController';
import ThemeController from './ContollersComponents/ThemeController/ThemeContoller';
import styled from 'styled-components';

const ControllersContaniner = styled.div`
  position: absolute;
  height: 100%;
  width: 0px;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  box-sizing: border-box;
`;

function Controllers({ setIsDark }) {
  return (
    <ControllersContaniner>
      <ThemeController setIsDark={setIsDark} />
      <PlayController />
    </ControllersContaniner>
  );
}

export default Controllers;
