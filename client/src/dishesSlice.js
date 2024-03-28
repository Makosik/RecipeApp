import { createSlice } from '@reduxjs/toolkit';

export const DishesSlice = createSlice({
  name: 'dishes',
  initialState: {
    dishes: [],
  },
  reducers: {
    setDishes: (state, action) => {
      state.dishes = action.payload;
    },
  },
});

export const { setDishes } = DishesSlice.actions;

export default DishesSlice.reducer;
