import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
   name: 'auth',
   initialState: {
      isLoggedIn: false,
      userId: null,
      userName: null,
      email: null,
      isAdmin: false,
   },
   reducers: {
      login: (state, action) => {
         state.isLoggedIn = true;
         state.userId = action.payload.userId;
         state.userName = action.payload.userName;
         state.isAdmin = action.payload.isAdmin;
         state.email = action.payload.email;
      },
      logout: (state) => {
         state.isLoggedIn = false;
         state.userId = null;
         state.userName = null;
         state.email = null;
         state.isAdmin = false;
      },
   },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
