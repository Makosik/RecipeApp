import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import '../style/LoginForm.css'

import { login } from '../redux/authSlice';
import Navigation from '../components/Navigation';

function LoginForm() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      mail: '',
      user_password: ''
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('/api/auth/login', formData);
         localStorage.setItem('token', response.data.token);
         const decodedToken = jwtDecode(response.data.token);
         navigate('/recipes');
         dispatch(login(decodedToken));
         console.log('Пользователь успешно аутентифицирован:', decodedToken);
      } catch (error) {
         console.error('Ошибка при аутентификации пользователя:', error.message);
         alert('Неверный email или пароль')
      }
   };

   return (
      <div className="login-container">
      <Navigation/>
         <form onSubmit={handleSubmit} className="login-form">
            <h2>Вход</h2>
            <div className='flex-form'>
              <label>Email:</label>
               <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
            </div>
            <div className='flex-form'>
               <label>Пароль:</label>
               <input type="password" name="user_password" value={formData.user_password} onChange={handleChange} />
            </div>
            <button type="submit">Войти</button>
            <span>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></span>
         </form>
      </div>
   );
}

export default LoginForm;