import { createSlice } from '@reduxjs/toolkit';

const initialPathsObj = {
  paths: [
    {
      path: [[null, null]],
      name: 'c2',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c5',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c9',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c11',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c15',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c17',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c20',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'c21',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'sch1',
      color: [],
    },
    {
      path: [[null, null]],
      name: 'sch2',
      color: [],
    },
  ],
};

const pathsDataObj = createSlice({
  name: 'pathsDataObjReducer',
  initialState: initialPathsObj,
  reducers: {
    updatePaths: (state, action) => {
      const { id, paths, color } = action.payload;
      const newPaths = state.paths.map((p) => {
        if (p.name === id) {
          return {
            name: id,
            path: [...paths],
            color: color,
          };
        } else return p;
      });
      return { paths: newPaths };
    },
    invisiblePath: (state, action) => {
      state.paths.map((p) => {
        if (p.name === action.payload) {
          return {
            name: action.payload,
            path: p.path,
            color: p.color.map((c) => {
              if (c[3] === undefined) c.push(0);
              return c;
            }),
          };
        } else return p;
      });
    },
    visiblePath: (state, action) => {
      state.paths.map((p) => {
        if (p.name === action.payload) {
          return {
            name: action.payload,
            path: p.path,
            color: p.color.map((c) => {
              if (c[3] !== undefined) c.pop();
              return c;
            }),
          };
        } else return p;
      });
    },
    AllInvisiblePath: (state) => {
      state.paths.map((p) => {
        return {
          name: p.name,
          path: p.path,
          color: p.color.map((c) => {
            if (c[3] === undefined) c.push(0);
            return c;
          }),
        };
      });
    },
    AllVisiblePath: (state) => {
      state.paths.map((p) => {
        return {
          name: p.name,
          path: p.path,
          color: p.color.map((c) => {
            if (c[3] !== undefined) c.pop();
            return c;
          }),
        };
      });
    },
  },
});

export const {
  updatePaths,
  invisiblePath,
  visiblePath,
  AllInvisiblePath,
  AllVisiblePath,
} = pathsDataObj.actions;

const pathsDataObjReducer = pathsDataObj.reducer;

export default pathsDataObjReducer;
