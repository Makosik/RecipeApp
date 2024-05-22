import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import dishesReducer from './dishesSlice';
import authReducer from './authSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
   reducer: {
      orders: ordersReducer,
      dishes: dishesReducer,
      auth: authReducer,
      favorite: favoriteReducer,
   },
});