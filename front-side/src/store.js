import { configureStore } from '@reduxjs/toolkit';
import carIconsObjReducer from 'Slices/CarIconsSlice';
import chooseCarObjReducer from 'Slices/ChooseCarObjSlice';
import passengerIconArrReducer from 'Slices/PassengerIconSlice';
import pathsDataObjReducer from 'Slices/PathsDataObjSlice';
import isDarkValueReducer from 'Slices/isDarkValueSlice';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  chooseCarObj: chooseCarObjReducer,
  pathsDataObj: pathsDataObjReducer,
  carIconsObj: carIconsObjReducer,
  passengerIconsArr: passengerIconArrReducer,
  isDarkValue: isDarkValueReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
