import { createSlice } from '@reduxjs/toolkit';

const initialChooseCarObj = {
  c2: '영종 02호',
  c5: '영종 05호',
  c9: '영종 09호',
  c11: '영종 11호',
  c15: '영종 15호',
  c17: '영종 17호',
  c20: '영종 20호',
  c21: '영종 21호',
  sch1: '예상 01호',
  sch2: '예상 02호',
};

const chooseCarObj = createSlice({
  name: 'chooseCarReducer',
  initialState: initialChooseCarObj,
  reducers: {
    addCar: (state, action) => {
      const { id, carName } = action.payload;
      state[id] = carName;
    },
    removeCar: (state, action) => {
      delete state[action.payload];
    },
    chooseAllCar: (state) => {
      Object.keys(initialChooseCarObj).forEach((key) => {
        state[key] = initialChooseCarObj[key];
      });
    },
    removeAllCar: (state) => {
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
  },
});

export const { addCar, removeCar, chooseAllCar, removeAllCar } =
  chooseCarObj.actions;

const chooseCarObjReducer = chooseCarObj.reducer;

export default chooseCarObjReducer;
