import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      const { userId, favArr } = action.payload;
      state[userId] = {};
      favArr.forEach(dishId => {
        state[userId][dishId] = true;
      });
    },
    toggleFavorite: (state, action) => {
      const { userId, dishId } = action.payload;
      if (!state[userId]) {
        state[userId] = {};
      }
      state[userId][dishId] = !state[userId][dishId];
    },
  },
});

export const { setFavorites, toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
