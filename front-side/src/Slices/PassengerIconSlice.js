import { createSlice } from '@reduxjs/toolkit';

const initialPassengerIconsArr = [];

const PassengerIconArr = createSlice({
  name: 'PassengerIconArr Reducer',
  initialState: initialPassengerIconsArr,
  reducers: {
    addPassengerIcon: (state, action) => {
      const idArr = state.map((v) => v.id);
      const { id, position, name } = action.payload;
      if (idArr.includes(id) === false) state.push({ id, position, name });
    },
    deletePassengerIcon: (state, action) => {
      return state.filter((v) => v.id !== action.payload);
    },
    remainPassengerIcon: (state, action) => {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const { addPassengerIcon, deletePassengerIcon, remainPassengerIcon } =
  PassengerIconArr.actions;

const passengerIconArrReducer = PassengerIconArr.reducer;

export default passengerIconArrReducer;
