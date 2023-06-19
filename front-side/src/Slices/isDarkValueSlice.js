import { createSlice } from '@reduxjs/toolkit';

const isDarkValue = createSlice({
  name: 'isDarkValueReducer',
  initialState: false,
  reducers: {
    updateIsDarkValue: (state) => !state,
  },
});

export const { updateIsDarkValue } = isDarkValue.actions;

const isDarkValueReducer = isDarkValue.reducer;

export default isDarkValueReducer;
