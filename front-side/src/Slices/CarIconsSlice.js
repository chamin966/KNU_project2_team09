import { createSlice } from '@reduxjs/toolkit';

const initialCarIconsObj = [
  {
    id: 'c2',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c5',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c9',
    position: [[null, null][(null, null)]],
    angle: 0,
    color: [],
  },
  {
    id: 'c11',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c15',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c17',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c20',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'c21',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'sch1',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
  {
    id: 'sch2',
    position: [[null, null]],
    angle: 0,
    color: [],
  },
];

const CarIconsObj = createSlice({
  name: 'carsIconObj Reducer',
  initialState: initialCarIconsObj,
  reducers: {
    updateCarIcons: (state, action) => {
      const { id, position, angle, color } = action.payload;

      const newIcons = state.map((icon) => {
        if (icon.id === id) {
          return {
            id: id,
            position: position,
            angle: angle,
            color: color,
          };
        } else return icon;
      });

      return newIcons;
    },
    invisibleCarIcon: (state, action) => {
      state.map((icon) => {
        if (icon.id === action.payload) {
          return {
            id: icon.id,
            position: icon.position,
            angle: icon.angle,
            color: icon.color.map((c) => {
              if (c[3] === undefined) c.push(0);
              return c;
            }),
          };
        } else return icon;
      });
    },
    visibleCarIcon: (state, action) => {
      state.map((icon) => {
        if (icon.id === action.payload) {
          return {
            id: icon.id,
            position: icon.position,
            angle: icon.angle,
            color: icon.color.map((c) => {
              if (c[3] !== undefined) c.pop();
              return c;
            }),
          };
        } else return icon;
      });
    },
    AllInvisibleCarIcon: (state) => {
      state.map((icon) => {
        return {
          id: icon.id,
          position: icon.position,
          angle: icon.angle,
          color: icon.color.map((c) => {
            if (c[3] === undefined) c.push(0);
            return c;
          }),
        };
      });
    },
    AllVisibleCarIcon: (state) => {
      state.map((icon) => {
        return {
          id: icon.id,
          position: icon.position,
          angle: icon.angle,
          color: icon.color.map((c) => {
            if (c[3] !== undefined) c.pop();
            return c;
          }),
        };
      });
    },
  },
});

export const {
  updateCarIcons,
  invisibleCarIcon,
  visibleCarIcon,
  AllInvisibleCarIcon,
  AllVisibleCarIcon,
} = CarIconsObj.actions;

const carIconsObjReducer = CarIconsObj.reducer;

export default carIconsObjReducer;
