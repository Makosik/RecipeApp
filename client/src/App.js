import React, { useEffect } from 'react';
import DataComponent from './pages/Recipes';
import AddDishForm from './pages/CreateOrder';
import ShowOrders from './pages/ShowOrders';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import ProtectedRouteUser from './components/ProtectedRouteUser';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login } from './redux/authSlice';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import Favorite from './pages/Favorite';
import Users from './pages/Users';
import OrderDetails from './pages/OrderDetails';
import RecipeDetails from './pages/RecipeDetails';

function App() {
   const dispatch = useDispatch();

   useEffect(() => {
      const authToken = localStorage.getItem('token');
      if (authToken) {
         const decodedToken = jwtDecode(authToken);
         dispatch(login(decodedToken));
      }
   }, [dispatch]);

   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
   const isAdmin = useSelector(state => state.auth.isAdmin);

   return (
      <Router>
         <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/recipes" element={<DataComponent />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/dishes/:id" element={<RecipeDetails />} />

            <Route path="/favorites" element={
               <ProtectedRouteUser isLoggedIn={isLoggedIn}>
                  <Favorite />
               </ProtectedRouteUser>} />

            <Route path="/create-recipe" element={
               <ProtectedRouteUser isLoggedIn={isLoggedIn}>
                  <AddDishForm />
               </ProtectedRouteUser>} />

            <Route path="/show-orders" element={
               <ProtectedRouteAdmin isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                  <ShowOrders />
               </ProtectedRouteAdmin>
            } />

            <Route path="/users" element={
               <ProtectedRouteAdmin isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                  <Users />
               </ProtectedRouteAdmin>
            } />

            <Route path="*" element={<DataComponent />} />

         </Routes>
      </Router>
   )
}

export default App