import React, { useEffect } from 'react'
import DataComponent from './components/DataComponent';
import AddDishForm from './components/CreateOrder';
import ShowOrders from './components/ShowOrders';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login } from './redux/authSlice';

function App() {
   const dispatch = useDispatch();

   useEffect(() => {
      const authToken = localStorage.getItem('token');
      if (authToken) {
         const decodedToken = jwtDecode(authToken);
         dispatch(login(decodedToken));
      }
   }, [dispatch]);


   return (
      <Router>
            <Routes>
               <Route path="/login" element={<LoginForm />} />
               <Route path="/register" element={<RegistrationForm />} />
               <Route path="/recipes" element={<DataComponent />} />
               <Route path="/create-recipe" element={<AddDishForm />} />
               <Route path="/show-orders" element={<ShowOrders />} />
               <Route path="*" element={<DataComponent />} />
            
            </Routes>
        </Router>
   )
}

export default App