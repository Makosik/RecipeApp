import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import dishesReducer from './dishesSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    dishes: dishesReducer,
  },
});