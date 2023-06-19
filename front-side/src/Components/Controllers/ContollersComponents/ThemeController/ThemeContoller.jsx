import { updateIsDarkValue } from 'Slices/isDarkValueSlice';
import { connect } from 'react-redux';
import styled from 'styled-components';

const ThemeContollerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: white;
  height: 30px;
  width: 110px;
  z-index: 1;
  border-radius: 9px;
  margin-right: 20px;
  margin-top: 20px;
`;

function ThemeController({ updateIsDarkValueAtThemeController }) {
  const onClickTheme = () => {
    updateIsDarkValueAtThemeController();
  };

  return (
    <ThemeContollerContainer>
      <label htmlFor='theme-dark-mode'>다크모드</label>
      <input type='checkbox' id='theme-dark-mode' onClick={onClickTheme} />
    </ThemeContollerContainer>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsDarkValueAtThemeController: () => dispatch(updateIsDarkValue()),
  };
}

export default connect(null, mapDispatchToProps)(ThemeController);
